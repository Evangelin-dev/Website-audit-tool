from django.urls import path, include
from rest_framework.routers import DefaultRouter
from audit_api.views import AuditTaskViewSet, AuditResultViewSet

router = DefaultRouter()
router.register(r'tasks', AuditTaskViewSet, basename='audit-task')
router.register(r'results', AuditResultViewSet, basename='audit-result')

urlpatterns = [
    path('', include(router.urls)),
]
