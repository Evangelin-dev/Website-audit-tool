# Website Audit Dashboard

A premium SaaS Website Audit Dashboard that analyzes websites in real-time using Python Django backend, React frontend, Celery workers, and Redis queue. **All data is real, analyzed directly from websites without mock data.**

## 🎯 Features

### Real-Time Analysis
- ✅ Actual HTTP requests to analyze websites
- ✅ Real performance metrics (not simulated)
- ✅ Live SEO analysis from HTML content
- ✅ Actual security header detection
- ✅ Real broken link detection

### Comprehensive Audit Modules

#### 📊 Performance Analysis
- Server response time
- Page load time
- Total page size
- Number of requests
- Resource breakdown

#### 🔍 SEO Analysis
- Title tag analysis
- Meta description quality
- Heading structure (H1, H2)
- Canonical tags
- Open Graph metadata
- Sitemap detection
- Robots.txt detection
- Mobile-friendliness check

#### 🔗 Link Analysis
- Total links count
- Internal vs external links
- Broken link detection with status codes
- Redirect chain tracking
- 404 and timeout detection

#### 🖼️ Image Analysis
- Total images count
- Missing ALT attributes
- Broken image URLs
- Image status codes

#### 🔐 Security Analysis
- HTTPS enabled check
- SSL certificate validation
- Security headers:
  - Strict-Transport-Security
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - And more...

#### 📱 Mobile Friendliness
- Viewport meta tag detection
- Responsive design indicators
- Language attribute check

### Premium Dashboard UI
- Real-time analysis progress
- Metric cards with live data
- Circular score indicators
- Interactive charts
- Detailed issue lists
- Export to PDF
- Modern dark theme with animations

## 🏗️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Axios (API client)

### Backend
- Django 4.2
- Django REST Framework
- Celery (task queue)
- Redis (message broker & cache)

### Web Crawling
- BeautifulSoup4 (HTML parsing)
- Requests (HTTP)
- Playwright (browser automation)
- lxml (XML/HTML processing)

### Database
- SQLite (development)
- PostgreSQL (production)

### PDF Export
- WeasyPrint

## 📦 Project Structure

```
website-audit-dashboard/
├── backend/                    # Django API & Celery workers
│   ├── audit_api/
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # DRF serializers
│   │   ├── auditor.py         # Main audit orchestrator
│   │   ├── analyzers/         # Analysis modules
│   │   │   ├── performance.py
│   │   │   ├── seo.py
│   │   │   ├── links.py
│   │   │   ├── images.py
│   │   │   ├── security.py
│   │   │   └── mobile.py
│   │   └── tasks/
│   │       └── celery.py      # Celery task
│   ├── audit_project/         # Django project settings
│   ├── manage.py
│   └── requirements.txt
├── frontend/                   # React dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── components/
│   │   │   ├── UIComponents.jsx
│   │   │   ├── OverviewSection.jsx
│   │   │   ├── SEOSection.jsx
│   │   │   ├── SecuritySection.jsx
│   │   │   ├── LinksSection.jsx
│   │   │   └── ImagesSection.jsx
│   │   ├── api/
│   │   │   └── client.js
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (for containerized setup)
- Redis 7+

### Local Development Setup

#### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create database
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### 2. Celery Setup (in another terminal)

```bash
cd backend
source venv/bin/activate

# Make sure Redis is running first
redis-cli ping  # Should return "PONG"

# Run Celery worker
celery -A audit_project worker -l info
```

#### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

#### 4. Access the Application

- Frontend: http://localhost:3000
- API: http://localhost:8000
- Admin: http://localhost:8000/admin

### Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Access services
# Frontend: http://localhost:3000
# API: http://localhost:8000
# Redis: localhost:6379
```

## 📝 API Documentation

### Create Audit Task

**POST** `/api/audit/tasks/`

```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "status": "pending",
  "created_at": "2024-03-05T10:00:00Z"
}
```

### Get Task Status

**GET** `/api/audit/tasks/{task_id}/`

**Response:**
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "status": "completed",
  "created_at": "2024-03-05T10:00:00Z",
  "started_at": "2024-03-05T10:00:05Z",
  "completed_at": "2024-03-05T10:00:45Z",
  "result": { ... }
}
```

### Get Audit Result

**GET** `/api/audit/results/by_task/?task_id={task_id}`

**Response:**
```json
{
  "url": "https://example.com",
  "domain": "example.com",
  "response_time_ms": 420,
  "page_load_time_ms": 2350,
  "page_size_mb": 1.92,
  "total_requests": 42,
  "title": "Example Domain",
  "title_length": 14,
  "meta_description": "Example website",
  "meta_description_length": 16,
  "h1_count": 1,
  "h2_count": 3,
  "total_links": 58,
  "internal_links": 45,
  "external_links": 13,
  "broken_links": 2,
  "total_images": 25,
  "broken_images": 1,
  "images_missing_alt": 5,
  "https_enabled": true,
  "ssl_grade": "A",
  "has_viewport_meta": true,
  "is_mobile_friendly": true,
  "missing_headers": ["Content-Security-Policy"],
  "security_headers": { ... },
  "broken_links_list": [ ... ],
  "broken_images_list": [ ... ],
  "analysis_duration_seconds": 40.25
}
```

## 🔧 Configuration

### Environment Variables

Backend (`.env`):
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/audit_db
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

Frontend (`.env`):
```
REACT_APP_API_URL=http://localhost:8000/api/audit
```

## 🎨 UI Features

### Real-Time Updates
- Live analysis progress with loading indicators
- Auto-refresh until analysis completes
- Toast notifications for user feedback

### Metric Visualization
- **Circular Scores**: Overall audit score with color coding (green/yellow/red)
- **Metric Cards**: Performance, SEO, Links, Images metrics
- **Section Cards**: Organized by analysis category
- **Status Indicators**: Visual checks (✅/❌) for quick assessment
- **Lists**: Detailed broken links and images with status codes

### Export Options
- **PDF Export**: Print audit report to PDF
- **Real Data Only**: All metrics derived from actual analysis

## 🔄 Workflow

### User Flow

1. **Enter URL** → User enters website URL on home page
2. **Create Task** → Frontend sends POST request to create audit task
3. **Queue Job** → Backend creates task and queues Celery job
4. **Run Analysis** → Celery worker executes audit:
   - Fetches website HTML once
   - Runs 6 parallel analyzers
   - Collects real metrics
   - Saves to database
5. **Display Results** → Frontend polls API and displays dashboard
6. **Export Report** → User can print/PDF the results

### Data Flow

```
HTML Content (fetched once)
    ↓
├─→ PerformanceAnalyzer → Response time, Page size, Requests
├─→ SEOAnalyzer → Title, Meta, H1/H2, Canonical, OG tags
├─→ LinkAnalyzer → Total, Internal, External, Broken links
├─→ ImageAnalyzer → Total, Missing ALT, Broken images
├─→ SecurityAnalyzer → HTTPS, Headers, SSL grade
└─→ MobileAnalyzer → Viewport, Responsive design, Lang attribute
    ↓
Combined Result (JSON)
    ↓
Database (AuditResult)
    ↓
REST API
    ↓
Frontend Dashboard
```

## 📊 Database Models

### AuditTask
- Tracks audit job status
- Links to AuditResult
- Stores Celery task ID
- Records timestamps

### AuditResult
- Complete audit metrics
- Raw JSON for full analysis
- Related broken links and images

### BrokenLink / BrokenImage
- Detailed list entries
- Status codes and reasons
- Linked to AuditResult

## 🛡️ Security Considerations

- ✅ Input validation (URL format verification)
- ✅ CORS configured for frontend origin
- ✅ Timeout protection (5-10 second timeouts)
- ✅ No sensitive data exposure
- ✅ Rate limiting recommendations (add in production)
- ✅ Authentication ready (implement as needed)

## 📈 Performance Optimization

- **Concurrent Requests**: ThreadPoolExecutor for parallel link/image checks
- **HTML Caching**: Single fetch, multiple analyzers
- **Task Queuing**: Celery handles long-running jobs
- **Result Caching**: Redis caches task statuses
- **Pagination**: API results paginated (50 per page)

## 🧪 Testing

### Manual Testing

```bash
# Test URL
https://example.com

# Test with real website
https://www.google.com

# Test local server
http://localhost:3000
```

### API Testing with curl

```bash
# Create audit
curl -X POST http://localhost:8000/api/audit/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Get status
curl http://localhost:8000/api/audit/tasks/{task_id}/

# Get results
curl http://localhost:8000/api/audit/results/by_task/?task_id={task_id}
```

## 🚢 Production Deployment

### Recommendations

1. **Database**: Upgrade to PostgreSQL
2. **Async**: Use Gunicorn + Uvicorn
3. **Caching**: Implement Redis caching layer
4. **Rate Limiting**: Add DRF throttling
5. **Authentication**: Implement API tokens
6. **Monitoring**: Add Sentry or similar
7. **Logging**: Configure ELK or CloudWatch
8. **Load Balancer**: Nginx for reverse proxy
9. **Auto-scaling**: Celery worker scaling based on queue
10. **CDN**: Static assets on CloudFront/Cloudflare

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 💬 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API error responses

## 🎓 Learning Resources

- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [React Documentation](https://react.dev/)
- [BeautifulSoup Guide](https://www.crummy.com/software/BeautifulSoup/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for website auditing excellence**
# Website-Audit
