# Deployment Guide

This guide covers deploying the Website Audit Dashboard to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups configured
- [ ] Static files collected
- [ ] HTTPS certificates ready
- [ ] Domain name configured
- [ ] Security headers configured
- [ ] Rate limiting configured
- [ ] Monitoring setup
- [ ] Error tracking setup

## Environment Setup

### 1. Create Production .env

```bash
# .env.production
DEBUG=False
SECRET_KEY=generate-a-secure-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@db.example.com:5432/audit_db
CELERY_BROKER_URL=redis://redis.example.com:6379/0
CELERY_RESULT_BACKEND=redis://redis.example.com:6379/0
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Generate SECRET_KEY:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### 2. Database Setup

Use PostgreSQL in production:

```bash
# Create database
createdb audit_db
createuser audit_user -P

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE audit_db TO audit_user;"
```

### 3. Redis Setup

Install and configure Redis:

```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl enable redis-server

# Configure persistence
# Edit /etc/redis/redis.conf
```

## Deployment Options

### Option 1: AWS EC2 + RDS + ElastiCache

#### Backend Setup

```bash
# SSH into EC2
ssh -i key.pem ec2-user@your-instance

# Install dependencies
sudo yum update -y
sudo yum install python3 python3-pip postgresql-devel -y

# Clone repo
git clone your-repo
cd website-audit-dashboard/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn

# Collect static files
python manage.py collectstatic --noinput

# Create systemd service for Django
sudo cat > /etc/systemd/system/audit-django.service << EOF
[Unit]
Description=Django Audit Service
After=network.target

[Service]
Type=notify
User=ec2-user
WorkingDirectory=/home/ec2-user/website-audit-dashboard/backend
Environment="PATH=/home/ec2-user/website-audit-dashboard/backend/venv/bin"
ExecStart=/home/ec2-user/website-audit-dashboard/backend/venv/bin/gunicorn \
    --workers 4 \
    --bind 0.0.0.0:8000 \
    audit_project.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable audit-django
sudo systemctl start audit-django
```

#### Celery Setup

```bash
# Create systemd service for Celery
sudo cat > /etc/systemd/system/audit-celery.service << EOF
[Unit]
Description=Celery Audit Service
After=network.target

[Service]
Type=forking
User=ec2-user
WorkingDirectory=/home/ec2-user/website-audit-dashboard/backend
Environment="PATH=/home/ec2-user/website-audit-dashboard/backend/venv/bin"
ExecStart=/home/ec2-user/website-audit-dashboard/backend/venv/bin/celery \
    -A audit_project worker \
    -c 4 \
    -l info

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable audit-celery
sudo systemctl start audit-celery
```

#### Nginx Configuration

```bash
# Install Nginx
sudo yum install nginx -y

# Create config
sudo cat > /etc/nginx/sites-available/audit << 'EOF'
upstream django {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL certificates (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Static files
    location /static/ {
        alias /home/ec2-user/website-audit-dashboard/backend/staticfiles/;
    }
    
    # API
    location /api/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin
    location /admin/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

sudo systemctl enable nginx
sudo systemctl start nginx
```

### Option 2: Heroku Deployment

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Create Heroku app
heroku create your-app-name

# Add buildpacks
heroku buildpacks:add heroku/python
heroku buildpacks:add heroku/nodejs

# Configure variables
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
heroku config:set CELERY_BROKER_URL=redis://...

# Add Redis
heroku addons:create heroku-postgresql:standard-0

# Deploy
git push heroku main

# Run migrations
heroku run python backend/manage.py migrate

# Create superuser
heroku run python backend/manage.py createsuperuser
```

### Option 3: Docker on VPS

```bash
# SSH into VPS
ssh root@your-vps

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.14.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and setup
git clone your-repo
cd website-audit-dashboard

# Create production docker-compose
# Update with production settings
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Setup SSL with Certbot
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com
```

## SSL Certificate Setup

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Monitoring & Logging

### Application Monitoring

```bash
# Install Sentry for error tracking
pip install sentry-sdk

# Configure in settings.py
import sentry_sdk
sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0
)
```

### Server Monitoring

```bash
# Install New Relic
pip install newrelic
newrelic-admin generate-config LICENSE_KEY newrelic.ini

# Or use Datadog agent
```

### Logging

```python
# Configure logging in settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/audit/error.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_audit_task_status ON audit_api_audittask(status);
CREATE INDEX idx_audit_task_created ON audit_api_audittask(created_at);
CREATE INDEX idx_audit_result_domain ON audit_api_auditresult(domain);
```

### Caching

```python
# Configure Redis caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### CDN Setup

- Use CloudFront for static files
- Configure CORS headers
- Set cache control headers

## Security

### Django Settings

```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

### Rate Limiting

```python
# Install django-ratelimit
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='100/h')
def audit_create(request):
    ...
```

## Backup & Recovery

### Database Backups

```bash
# Automated daily backup
0 2 * * * pg_dump audit_db > /backups/audit_db_$(date +\%Y\%m\%d).sql

# Restore
psql audit_db < /backups/audit_db_backup.sql
```

### Redis Persistence

```bash
# Configure in redis.conf
save 900 1
save 300 10
save 60 10000

# Enable AOF
appendonly yes
```

## Maintenance

### Regular Tasks

- Monitor disk space
- Review error logs
- Update dependencies
- Clean old audit records
- Monitor Celery queue

### Database Cleanup

```python
# management/commands/cleanup_audits.py
from django.core.management.base import BaseCommand
from audit_api.models import AuditTask
from datetime import timedelta
from django.utils import timezone

class Command(BaseCommand):
    def handle(self, *args, **options):
        cutoff = timezone.now() - timedelta(days=30)
        AuditTask.objects.filter(created_at__lt=cutoff).delete()
```

## Troubleshooting

### High Memory Usage

```bash
# Add Celery task timeout
CELERY_TASK_TIME_LIMIT = 300  # 5 minutes
CELERY_TASK_SOFT_TIME_LIMIT = 240

# Limit concurrent tasks
# Adjust worker concurrency
```

### Database Connection Issues

```bash
# Increase connection pool
DATABASES['default']['CONN_MAX_AGE'] = 600
```

### Slow API Response

```bash
# Enable query logging
python manage.py runserver --debug-sql
```

## Rollback Procedure

```bash
# Git rollback
git revert <commit-hash>
git push heroku main

# Database migration rollback
python manage.py migrate audit_api 0001_initial

# Docker rollback
docker pull your-repo:previous-tag
docker-compose up -d
```

## Monitoring Checklist

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic/Datadog)
- [ ] Uptime monitoring (Pingdom)
- [ ] Log aggregation (ELK/Splunk)
- [ ] Database backups
- [ ] SSL certificate expiry
- [ ] Disk space usage
- [ ] Memory usage
- [ ] API response times
- [ ] Celery queue length

---

For more help with specific platforms, check their documentation or AWS/Heroku knowledge bases.
