# Makefile for Website Audit Dashboard

.PHONY: help setup backend frontend redis celery clean test lint format run dev

help:
	@echo "Website Audit Dashboard - Available Commands"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup           - Complete setup for all services"
	@echo "  make backend-setup   - Setup Django backend only"
	@echo "  make frontend-setup  - Setup React frontend only"
	@echo ""
	@echo "Running Services:"
	@echo "  make run             - Run all services (requires 4 terminals)"
	@echo "  make backend         - Run Django backend server"
	@echo "  make frontend        - Run React frontend server"
	@echo "  make celery          - Run Celery worker"
	@echo "  make redis           - Start Redis server"
	@echo "  make dev             - Run with Docker Compose"
	@echo ""
	@echo "Development:"
	@echo "  make clean           - Clean cache and temp files"
	@echo "  make test            - Run all tests"
	@echo "  make lint            - Lint code"
	@echo "  make format          - Format code"
	@echo "  make migrations      - Create and apply migrations"
	@echo ""

setup: backend-setup frontend-setup
	@echo "✅ Setup complete! Run 'make dev' or 'make run'"

backend-setup:
	@echo "📦 Setting up Django backend..."
	cd backend && python -m venv venv
	cd backend && . venv/bin/activate && pip install -r requirements.txt
	cd backend && python manage.py migrate
	@echo "✅ Backend setup complete!"

frontend-setup:
	@echo "📦 Setting up React frontend..."
	cd frontend && npm install
	@echo "✅ Frontend setup complete!"

run:
	@echo "🚀 Starting all services..."
	@echo "You need 4 terminals for:"
	@echo "  Terminal 1: make redis"
	@echo "  Terminal 2: make backend"
	@echo "  Terminal 3: make celery"
	@echo "  Terminal 4: make frontend"

backend:
	@echo "Starting Django backend..."
	cd backend && . venv/bin/activate && python manage.py runserver

frontend:
	@echo "Starting React frontend..."
	cd frontend && npm start

celery:
	@echo "Starting Celery worker..."
	cd backend && . venv/bin/activate && celery -A audit_project worker -l info

redis:
	@echo "Starting Redis server..."
	redis-server

dev:
	@echo "🐳 Starting with Docker Compose..."
	docker-compose up --build

dev-down:
	@echo "Stopping Docker services..."
	docker-compose down

clean:
	@echo "🧹 Cleaning up..."
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name ".DS_Store" -delete
	rm -rf frontend/build
	rm -rf frontend/node_modules/.cache
	@echo "✅ Cleanup complete!"

test:
	@echo "🧪 Running tests..."
	cd backend && python manage.py test
	cd frontend && npm test -- --coverage --watchAll=false

lint:
	@echo "🔍 Linting code..."
	cd backend && . venv/bin/activate && flake8 audit_api/
	cd backend && . venv/bin/activate && black --check audit_api/

format:
	@echo "✨ Formatting code..."
	cd backend && . venv/bin/activate && black audit_api/
	cd backend && . venv/bin/activate && isort audit_api/

migrations:
	@echo "📝 Creating migrations..."
	cd backend && python manage.py makemigrations
	cd backend && python manage.py migrate
	@echo "✅ Migrations complete!"

db-shell:
	@echo "Opening Django shell..."
	cd backend && . venv/bin/activate && python manage.py shell

db-reset:
	@echo "⚠️  Resetting database..."
	cd backend && rm -f db.sqlite3
	cd backend && python manage.py migrate
	cd backend && python manage.py createsuperuser
	@echo "✅ Database reset complete!"

admin:
	@echo "Opening Django admin..."
	@echo "http://localhost:8000/admin"

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-celery:
	docker-compose logs -f celery_worker

freeze:
	@echo "Freezing dependencies..."
	cd backend && . venv/bin/activate && pip freeze > requirements.txt
	cd frontend && npm list --depth=0 > dependencies.txt

version:
	@echo "Python version:"
	python --version
	@echo "Node version:"
	node --version
	@echo "npm version:"
	npm --version
	@echo "Docker version:"
	docker --version
	@echo "Redis version:"
	redis-server --version

.PHONY: help setup backend-setup frontend-setup run backend frontend celery redis dev dev-down clean test lint format migrations db-shell db-reset admin logs-backend logs-frontend logs-celery freeze version
