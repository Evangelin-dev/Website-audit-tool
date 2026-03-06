from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import uuid
from audit_api.serializers import CreateAuditSerializer, AuditReporterInfoSerializer
from audit_api.models import AuditReporterInfo
from audit_api.auditor import WebsiteAuditor


def flatten_audit_result(audit_result: dict) -> dict:
    """Transform nested analysis result into flat format for frontend components."""
    perf = audit_result.get('performance', {})
    seo = audit_result.get('seo', {})
    links = audit_result.get('links', {})
    images = audit_result.get('images', {})
    security = audit_result.get('security', {})
    mobile = audit_result.get('mobile', {})
    
    # Get missing headers
    security_headers = security.get('security_headers', {})
    missing_headers = [header for header, value in security_headers.items() 
                     if header != 'error' and value == 'Missing']
    
    return {
        'url': audit_result.get('url'),
        'domain': audit_result.get('domain'),
        'analysis_duration_seconds': audit_result.get('analysis_duration_seconds'),
        
        # Performance
        'response_time_ms': perf.get('response_time_ms', 0),
        'page_load_time_ms': perf.get('page_load_time_ms', 0),
        'page_size_mb': perf.get('page_size_mb', 0),
        'page_size_bytes': perf.get('page_size_bytes', 0),
        'total_requests': perf.get('total_requests', 0),
        'script_requests': perf.get('scripts', 0),
        'stylesheet_requests': perf.get('stylesheets', 0),
        'image_requests': perf.get('images', 0),
        'iframe_requests': perf.get('iframes', 0),
        'status_code': perf.get('status_code', 200),
        
        # SEO
        'title': seo.get('title', ''),
        'title_length': seo.get('title_length', 0),
        'meta_description': seo.get('meta_description', ''),
        'meta_description_length': seo.get('meta_description_length', 0),
        'h1_count': seo.get('h1_count', 0),
        'h2_count': seo.get('h2_count', 0),
        'canonical_tag': seo.get('canonical_tag', ''),
        'robots_meta_tag': seo.get('robots_meta_tag', ''),
        'og_title': seo.get('og_title', ''),
        'og_description': seo.get('og_description', ''),
        'og_image': seo.get('og_image', ''),
        'sitemap_exists': seo.get('sitemap_exists', False),
        'sitemap_url': seo.get('sitemap_url', ''),
        'robots_txt_exists': seo.get('robots_txt_exists', False),
        
        # Links
        'total_links': links.get('total_links', 0),
        'internal_links': links.get('internal_links', 0),
        'external_links': links.get('external_links', 0),
        'broken_links': links.get('broken_links_count', 0),
        'redirects_count': links.get('redirects_count', 0),
        'broken_links_list': links.get('broken_links', []),
        
        # Images
        'total_images': images.get('total_images', 0),
        'broken_images': images.get('broken_images_count', 0),
        'images_missing_alt': images.get('images_missing_alt_count', 0),
        'broken_images_list': images.get('broken_images', []),
        
        # Security
        'https_enabled': security.get('https_enabled', False),
        'ssl_grade': security.get('ssl_grade', ''),
        'security_headers': security_headers,
        'missing_headers': missing_headers,
        
        # Mobile
        'has_viewport_meta': mobile.get('has_viewport_meta', False),
        'is_mobile_friendly': mobile.get('has_responsive_design', False),
        'missing_lang_attribute': mobile.get('missing_lang_attribute', False),
        
        # Raw nested data for advanced views
        'performance': perf,
        'seo': seo,
        'links': links,
        'images': images,
        'security': security,
        'mobile': mobile,
        'full_analysis': audit_result,
    }


class AuditTaskViewSet(viewsets.ViewSet):
    """ViewSet for managing audit tasks."""
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """Create a new audit task and run analysis synchronously."""
        serializer = CreateAuditSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        url = serializer.validated_data['url']
        task_id = str(uuid.uuid4())
        
        try:
            # Run audit synchronously (no database, no celery)
            auditor = WebsiteAuditor(url, task_id)
            audit_result = auditor.audit()
            
            # Flatten results for frontend
            flat_result = flatten_audit_result(audit_result)
            
            # Return results directly
            return Response({
                'id': task_id,
                'url': url,
                'status': 'completed',
                'result': flat_result,
                'created_at': None,
                'started_at': None,
                'completed_at': None,
                'error_message': None,
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'id': task_id,
                'url': url,
                'status': 'failed',
                'result': None,
                'created_at': None,
                'started_at': None,
                'completed_at': None,
                'error_message': str(e),
            }, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """Get status of audit task."""
        return Response({
            'error': 'Use create endpoint for analysis'
        }, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        """List is not supported in no-database mode."""
        return Response({
            'error': 'Listing is not supported in no-database mode'
        }, status=status.HTTP_400_BAD_REQUEST)


class AuditResultViewSet(viewsets.ViewSet):
    """ViewSet for audit results (read-only in no-database mode)."""
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def by_task(self, request):
        """Get result by task ID."""
        return Response({
            'error': 'Data is returned directly from audit creation'
        }, status=status.HTTP_400_BAD_REQUEST)


class AuditReporterInfoViewSet(viewsets.ModelViewSet):
    """ViewSet for managing audit reporter information."""
    queryset = AuditReporterInfo.objects.all()
    serializer_class = AuditReporterInfoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """Save user details for audit report access."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def get_by_task_id(self, request):
        """Get reporter info by task ID."""
        task_id = request.query_params.get('task_id')
        if not task_id:
            return Response({'error': 'task_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            reporter_info = AuditReporterInfo.objects.get(task_id=task_id)
            serializer = self.get_serializer(reporter_info)
            return Response(serializer.data)
        except AuditReporterInfo.DoesNotExist:
            return Response({'error': 'Reporter info not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def all_submissions(self, request):
        """Get all submissions (for portal)."""
        reporter_infos = AuditReporterInfo.objects.all()
        serializer = self.get_serializer(reporter_infos, many=True)
        return Response(serializer.data)
