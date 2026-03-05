# Website Audit Dashboard - Quick Reference

## API Endpoints

### Create Audit
```
POST /api/audit/tasks/
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Get Task Status
```
GET /api/audit/tasks/
GET /api/audit/tasks/{task_id}/
```

### Get Audit Result
```
GET /api/audit/results/
GET /api/audit/results/by_task/?task_id={task_id}
```

## Common Commands

### Backend
```bash
# Migrations
python manage.py makemigrations
python manage.py migrate

# Run server
python manage.py runserver

# Shell
python manage.py shell

# Create user
python manage.py createsuperuser
```

### Celery
```bash
# Start worker
celery -A audit_project worker -l info

# Windows (with solo pool)
celery -A audit_project worker -l info --pool=solo

# Purge tasks
celery -A audit_project purge
```

### Frontend
```bash
# Install deps
npm install

# Start dev
npm start

# Build
npm run build

# Test
npm test
```

### Docker
```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Key Files

- `.env.example` - Environment template
- `.gitignore` - Git ignore patterns
- `requirements.txt` - Python packages
- `package.json` - Node packages
- `docker-compose.yml` - Docker services
- `manage.py` - Django CLI
- `celery.py` - Celery config

## Status Codes

- `pending` - Waiting to process
- `processing` - Currently analyzing
- `completed` - Done with results
- `failed` - Error occurred

## Troubleshooting Checklist

- [ ] Redis running? (`redis-cli ping`)
- [ ] Virtual env activated? (`source venv/bin/activate`)
- [ ] Dependencies installed? (`pip install -r requirements.txt`)
- [ ] Database migrated? (`python manage.py migrate`)
- [ ] Celery worker running? (`celery ... worker`)
- [ ] CORS configured? (Check settings.py)
- [ ] Ports available? (8000, 3000, 6379)
- [ ] Environment variables set? (Check .env)

## Performance Notes

- Keep Redis memory under control
- Adjust Celery worker count (CPU cores)
- Use PostgreSQL in production
- Implement caching for repeated URLs
- Monitor task queue length
- Clean old audit tasks periodically

---

For more details, see README.md or SETUP.md
