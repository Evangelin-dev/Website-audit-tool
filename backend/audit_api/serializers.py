from rest_framework import serializers
from .models import AuditTask, AuditResult, BrokenLink, BrokenImage, AuditReporterInfo


class BrokenLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrokenLink
        fields = ['url', 'status_code', 'reason']


class BrokenImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrokenImage
        fields = ['url', 'status_code', 'reason']


class AuditResultSerializer(serializers.ModelSerializer):
    broken_links_list = BrokenLinkSerializer(many=True, read_only=True)
    broken_images_list = BrokenImageSerializer(many=True, read_only=True)

    class Meta:
        model = AuditResult
        fields = [
            'id', 'url', 'domain', 'response_time_ms', 'page_load_time_ms',
            'page_size_mb', 'total_requests', 'title', 'title_length',
            'meta_description', 'meta_description_length', 'h1_count', 'h2_count',
            'canonical_tag', 'robots_meta_tag', 'og_title', 'og_description',
            'og_image', 'sitemap_exists', 'sitemap_url', 'robots_txt_exists',
            'total_links', 'internal_links', 'external_links', 'broken_links',
            'redirects_count', 'total_images', 'broken_images', 'images_missing_alt',
            'https_enabled', 'ssl_grade', 'security_headers', 'missing_headers',
            'has_viewport_meta', 'is_mobile_friendly', 'missing_lang_attribute',
            'broken_links_list', 'broken_images_list', 'full_analysis',
            'created_at', 'analysis_duration_seconds'
        ]


class AuditTaskSerializer(serializers.ModelSerializer):
    result = AuditResultSerializer(read_only=True)

    class Meta:
        model = AuditTask
        fields = ['id', 'url', 'status', 'created_at', 'started_at', 'completed_at',
                  'error_message', 'result']
        read_only_fields = ['id', 'created_at', 'started_at', 'completed_at', 'status']


class CreateAuditSerializer(serializers.Serializer):
    url = serializers.URLField()

    def validate_url(self, value):
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value


class AuditReporterInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditReporterInfo
        fields = ['id', 'task', 'website_url', 'user_name', 'phone_number', 'submission_date', 'updated_at']
        read_only_fields = ['id', 'submission_date', 'updated_at']

