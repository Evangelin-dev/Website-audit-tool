from django.db import models
from django.utils import timezone
import uuid


class AuditTask(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.URLField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True, null=True)
    celery_task_id = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Audit {self.url} - {self.status}"


class AuditResult(models.Model):
    task = models.OneToOneField(AuditTask, on_delete=models.CASCADE, related_name='result')
    url = models.URLField()
    domain = models.CharField(max_length=255)
    
    # Performance Data
    response_time_ms = models.IntegerField(null=True, blank=True)
    page_load_time_ms = models.IntegerField(null=True, blank=True)
    page_size_mb = models.FloatField(null=True, blank=True)
    total_requests = models.IntegerField(null=True, blank=True)
    
    # SEO Data
    title = models.CharField(max_length=500, blank=True)
    title_length = models.IntegerField(null=True, blank=True)
    meta_description = models.TextField(blank=True)
    meta_description_length = models.IntegerField(null=True, blank=True)
    h1_count = models.IntegerField(null=True, blank=True)
    h2_count = models.IntegerField(null=True, blank=True)
    canonical_tag = models.URLField(blank=True, null=True)
    robots_meta_tag = models.CharField(max_length=200, blank=True)
    
    # Open Graph / Social
    og_title = models.CharField(max_length=500, blank=True)
    og_description = models.TextField(blank=True)
    og_image = models.URLField(blank=True, null=True)
    
    # Sitemaps and Robots
    sitemap_exists = models.BooleanField(default=False)
    sitemap_url = models.URLField(blank=True, null=True)
    robots_txt_exists = models.BooleanField(default=False)
    
    # Links Data
    total_links = models.IntegerField(null=True, blank=True)
    internal_links = models.IntegerField(null=True, blank=True)
    external_links = models.IntegerField(null=True, blank=True)
    broken_links = models.IntegerField(null=True, blank=True)
    redirects_count = models.IntegerField(null=True, blank=True)
    
    # Images Data
    total_images = models.IntegerField(null=True, blank=True)
    broken_images = models.IntegerField(null=True, blank=True)
    images_missing_alt = models.IntegerField(null=True, blank=True)
    
    # Security Data
    https_enabled = models.BooleanField(default=False)
    ssl_grade = models.CharField(max_length=20, blank=True)
    
    # Headers Data (stored as JSON string)
    security_headers = models.JSONField(default=dict)
    missing_headers = models.JSONField(default=list)
    
    # Mobile Friendliness
    has_viewport_meta = models.BooleanField(default=False)
    is_mobile_friendly = models.BooleanField(default=False)
    
    # Accessibility
    missing_lang_attribute = models.BooleanField(default=False)
    
    # Full analysis data (raw JSON)
    full_analysis = models.JSONField(default=dict)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    analysis_duration_seconds = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Result for {self.url}"


class AuditReporterInfo(models.Model):
    """Store user information and audit details for report access."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.OneToOneField(AuditTask, on_delete=models.CASCADE, related_name='reporter_info', null=True, blank=True)
    website_url = models.URLField()
    user_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=254, blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    submission_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-submission_date']
    
    def __str__(self):
        return f"{self.user_name} - {self.website_url}"


class BrokenLink(models.Model):
    result = models.ForeignKey(AuditResult, on_delete=models.CASCADE, related_name='broken_links_list')
    url = models.URLField()
    status_code = models.IntegerField(null=True, blank=True)
    reason = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.url} - {self.status_code}"


class BrokenImage(models.Model):
    result = models.ForeignKey(AuditResult, on_delete=models.CASCADE, related_name='broken_images_list')
    url = models.URLField()
    status_code = models.IntegerField(null=True, blank=True)
    reason = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.url} - {self.status_code}"
