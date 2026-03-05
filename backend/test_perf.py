from audit_api.auditor import WebsiteAuditor
import json

auditor = WebsiteAuditor('https://www.example.com', 'test-task')
result = auditor.audit()

print('Performance data:')
perf = result.get('performance', {})
print(json.dumps({k: perf.get(k) for k in ['total_requests', 'scripts', 'stylesheets', 'images', 'iframes']}, indent=2))
