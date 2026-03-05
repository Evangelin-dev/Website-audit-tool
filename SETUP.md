# Quick Setup Guide

This guide walks you through setting up the Website Audit Dashboard on your local machine.

## System Requirements

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher  
- **Redis**: 7 or higher
- **Git**: Latest version
- **Memory**: 2GB recommended
- **Disk Space**: 2GB

## Option 1: Local Development (Recommended for development)

### Step 1: Clone and Navigate

```bash
cd websitee audit
```

### Step 2: Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Follow the prompts to create username/password

# Verify migrations
python manage.py showmigrations
```

### Step 3: Start Redis

Make sure Redis is installed and running:

```bash
# On Windows (if installed via WSL or native):
redis-server

# On macOS:
brew services start redis

# On Linux:
sudo systemctl start redis-server

# Verify Redis is running:
redis-cli ping
# Should respond with: PONG
```

### Step 4: Start Django Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

You should see:
```
Django version 4.2.0, using settings 'audit_project.settings'
Starting development server at http://127.0.0.1:8000/
```

### Step 5: Start Celery Worker (Terminal 2)

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
celery -A audit_project worker -l info --pool=solo
```

**Note**: On Windows, use `--pool=solo` flag or `celery -A audit_project worker -l info -c 1`

You should see:
```
 [*] Ready to accept tasks
```

### Step 6: Set Up Frontend (Terminal 3)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

This should automatically open http://localhost:3000 in your browser.

### Step 7: Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **API Health Check**: http://localhost:8000/api/audit/tasks/
- **Django Admin**: http://localhost:8000/admin
  - Username: (what you created in Step 2)
  - Password: (what you created in Step 2)

## Option 2: Docker Setup (Easiest)

### Step 1: Install Docker Desktop

Download and install from https://www.docker.com/products/docker-desktop

### Step 2: Start Services

```bash
# From the project root directory
docker-compose up --build

# This will automatically start:
# - PostgreSQL database
# - Redis
# - Django backend (port 8000)
# - Celery worker
# - React frontend (port 3000)
```

Wait for all services to start (takes 1-2 minutes on first run).

### Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

**Note**: Docker will initialize the database automatically.

## Testing the Application

### Test 1: Simple Domain Audit

1. Open http://localhost:3000
2. Enter a website URL: `https://example.com`
3. Click "Start Audit"
4. Watch the real-time analysis progress
5. View the results dashboard

### Test 2: Local Server Test

```bash
# In another terminal, start a simple test server
python -m http.server 8080

# In the frontend, enter:
http://localhost:8080

# Should analyze successfully
```

### Test 3: API Direct Test

```bash
# Create an audit task
curl -X POST http://localhost:8000/api/audit/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Response will include task ID, save it as {TASK_ID}

# Check status
curl http://localhost:8000/api/audit/tasks/{TASK_ID}/

# Get results (when status is "completed")
curl http://localhost:8000/api/audit/results/by_task/?task_id={TASK_ID}
```

## Troubleshooting

### Issue: "Redis connection refused"

**Solution**:
```bash
# Check if Redis is running
redis-cli ping

# If not, start it:
# Windows: redis-server
# macOS: brew services start redis
# Linux: sudo systemctl start redis-server
```

### Issue: "No module named 'audit_api'"

**Solution**:
```bash
cd backend
# Make sure you're in the right directory and virtual env is activated
python manage.py migrate
```

### Issue: "npm ERR! ERESOLVE unable to resolve dependency tree"

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start
```

### Issue: Port 3000 or 8000 already in use

**Solution**:
```bash
# Find process using port (on macOS/Linux)
lsof -i :3000
lsof -i :8000

# Kill process (replace PID)
kill -9 <PID>

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Celery tasks not running

**Solution**:
```bash
# Make sure Redis is running
redis-cli ping  # Should return PONG

# Check Celery logs for errors
celery -A audit_project worker -l debug
```

### Issue: "ModuleNotFoundError: No module named 'django'"

**Solution**:
```bash
cd backend
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install requirements
pip install -r requirements.txt
```

## Development Workflow

### Making Changes to Backend

1. Edit Python files in `backend/audit_api/`
2. Django auto-reloads on file changes
3. Check http://localhost:8000/api/audit/tasks/ for changes

### Making Changes to Frontend

1. Edit files in `frontend/src/`
2. React auto-refreshes on file changes
3. Check http://localhost:3000 in browser

### Adding Database Models

1. Edit `backend/audit_api/models.py`
2. Create migration: `python manage.py makemigrations`
3. Apply migration: `python manage.py migrate`
4. Access http://localhost:8000/admin to manage

### Adding New Analyzers

1. Create new file in `backend/audit_api/analyzers/`
2. Import in `backend/audit_api/auditor.py`
3. Integrate in `WebsiteAuditor.audit()` method
4. Add results to `AuditResult` model
5. Export via API serializers

## Environment Variables

### Backend (.env file)

```
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_URL=sqlite:///db.sqlite3
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (.env file)

```
REACT_APP_API_URL=http://localhost:8000/api/audit
```

## Next Steps

1. ✅ **Explore the Dashboard** - Run a few audits to see real data
2. ✅ **Check Admin Panel** - Manage audits at http://localhost:8000/admin
3. ✅ **Review API Docs** - Test endpoints with curl or Postman
4. ✅ **Customize Analyzers** - Extend analysis modules for your needs
5. ✅ **Deploy to Production** - Follow production deployment guide

## Production Deployment

When ready for production:

1. Change `DEBUG=False`
2. Set strong `SECRET_KEY`
3. Use PostgreSQL database
4. Enable HTTPS
5. Configure proper CORS origins
6. Set up monitoring and logging
7. Use Gunicorn + Nginx
8. Configure Celery scaling
9. Set up automatic backups
10. Enable rate limiting

See README.md for detailed deployment instructions.

## Performance Tips

- **Optimize Network**: Use faster internet for testing
- **Redis Memory**: Monitor Redis memory usage
- **Celery Workers**: Adjust worker count based on CPU cores
- **Database**: Use PostgreSQL for production
- **Caching**: Implement response caching for repeated audits
- **Async Tasks**: Leverage Celery for long operations

## Getting Help

- Check error logs in terminal windows
- Review Django logs: `python manage.py ...`
- Check Celery worker logs
- Common issues above
- Read README.md for more details

## Project Structure Reference

```
websitee audit/
├── backend/
│   ├── audit_api/
│   │   ├── models.py          ← Database schemas
│   │   ├── views.py           ← API endpoints
│   │   ├── serializers.py     ← Data serializers
│   │   ├── auditor.py         ← Main audit logic
│   │   ├── analyzers/         ← Analysis modules
│   │   └── tasks/
│   │       └── celery.py      ← Celery tasks
│   ├── audit_project/
│   │   ├── settings.py        ← Django config
│   │   ├── urls.py            ← URL routing
│   │   └── celery.py          ← Celery config
│   ├── manage.py              ← Django CLI
│   └── requirements.txt        ← Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/             ← React pages
│   │   ├── components/        ← React components
│   │   ├── api/               ← API client
│   │   └── App.jsx            ← Main app
│   ├── public/                ← Static files
│   └── package.json           ← Node dependencies
├── docker-compose.yml         ← Docker configuration
└── README.md                  ← Full documentation
```

---

**You're all set! Start the application and analyze some websites! 🚀**
