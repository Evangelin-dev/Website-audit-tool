from django.contrib import admin
from .models import AuditTask, AuditResult, BrokenLink, BrokenImage


@admin.register(AuditTask)
class AuditTaskAdmin(admin.ModelAdmin):
    list_display = ['url', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['url']


@admin.register(AuditResult)
class AuditResultAdmin(admin.ModelAdmin):
    list_display = ['domain', 'url', 'created_at']
    search_fields = ['url', 'domain']


@admin.register(BrokenLink)
class BrokenLinkAdmin(admin.ModelAdmin):
    list_display = ['url', 'status_code', 'result']


@admin.register(BrokenImage)
class BrokenImageAdmin(admin.ModelAdmin):
    list_display = ['url', 'status_code', 'result']
