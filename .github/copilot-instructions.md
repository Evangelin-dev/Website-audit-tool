# Website Audit Dashboard - Development Instructions

## Project Overview
A premium SaaS Website Audit Dashboard that analyzes websites in real-time using Python Django backend, React frontend, Celery workers, and Redis queue. All data is real, analyzed directly from websites without mock data.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Django, Django REST Framework
- **Task Queue**: Celery, Redis
- **Crawling**: BeautifulSoup, Requests, lxml, Playwright
- **PDF**: WeasyPrint

## Project Structure
```
.
├── backend/          # Django API and Celery workers
├── frontend/         # React dashboard
├── docker-compose.yml
└── README.md
```

## Development Checklist
- [x] Create workspace structure
- [ ] Set up Django backend with models and API
- [ ] Create Celery tasks for audit workers
- [ ] Build website analysis modules (SEO, Performance, Security, etc.)
- [ ] Set up React frontend with dashboard UI
- [ ] Implement premium dashboard components
- [ ] Add PDF report generation
- [ ] Configure Docker and Redis
- [ ] Testing and deployment

## Key Requirements
- **NO mock data** - all metrics from real analysis
- **NO placeholder values** - only calculated results
- **Real HTTP requests** - BeautifulSoup, Requests, Playwright
- **Structured JSON output** - single source of truth
- **Premium UI** - metric cards, circular scores, charts

## Running the Project
1. **Backend**: Django REST API on port 8000
2. **Frontend**: React on port 3000
3. **Redis**: Queue manager on port 6379
4. **Celery**: Background worker processes

See README.md for detailed setup instructions.
