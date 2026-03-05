# Website Audit Dashboard - Contributing Guide

## Code Style

### Python
- Follow PEP 8
- Use 4 spaces for indentation
- Max line length: 100 characters
- Format with `black`: `black audit_api/`
- Lint with `flake8`: `flake8 audit_api/`
- Sort imports with `isort`: `isort audit_api/`

### JavaScript
- Use ES6+ syntax
- Follow React best practices
- 2 spaces for indentation
- Components in separate files
- Props validation with PropTypes

## Testing

### Backend
```bash
# Run tests
python manage.py test

# With coverage
pytest --cov=audit_api

# Run specific test
python manage.py test audit_api.tests.TestAuditModel
```

### Frontend
```bash
# Run tests
npm test

# With coverage
npm test -- --coverage
```

## Adding Features

### New Analyzer Module

1. Create file: `backend/audit_api/analyzers/new_analyzer.py`
2. Implement `analyze()` method
3. Import in `auditor.py`
4. Add to `WebsiteAuditor` class
5. Update `AuditResult` model if needed
6. Test with sample website

### New Dashboard Component

1. Create file: `frontend/src/components/NewComponent.jsx`
2. Import in relevant page
3. Add styling with Tailwind
4. Test with sample data
5. Add animation with Framer Motion

### New API Endpoint

1. Add view in `views.py`
2. Add route in `urls.py`
3. Add serializer in `serializers.py`
4. Test with curl/Postman
5. Document in README

## Git Workflow

```bash
# Create branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "Add your feature"

# Push changes
git push origin feature/your-feature

# Create Pull Request
```

## Commit Messages

- Use imperative mood: "Add feature" not "Added feature"
- Reference issues: "Fix #123"
- Keep first line under 50 characters
- Add detailed description if needed

## Documentation

- Update README.md for user-facing changes
- Update docstrings for code changes
- Add type hints in Python
- Comment complex logic

## Performance

- Profile slow operations
- Use database indexing
- Cache expensive operations
- Optimize bundle size

## Security

- Validate all inputs
- Never commit secrets
- Follow OWASP guidelines
- Use security headers

---

Thank you for contributing! 🎉
