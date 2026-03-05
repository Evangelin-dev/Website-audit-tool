import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from audit_api.analyzers.performance import PerformanceAnalyzer
from audit_api.analyzers.seo import SEOAnalyzer
from audit_api.analyzers.links import LinkAnalyzer
from audit_api.analyzers.images import ImageAnalyzer
from audit_api.analyzers.security import SecurityAnalyzer
from audit_api.analyzers.mobile import MobileAnalyzer


class WebsiteAuditor:
    """Main orchestrator for complete website analysis."""
    
    def __init__(self, url: str, task_id: str):
        self.url = url
        self.task_id = task_id
        self.domain = urlparse(url).netloc
        self.html_content = None
        self.performance_metrics = {}
        self.start_time = time.time()
        
    def audit(self) -> dict:
        """Execute complete website audit."""
        try:
            # Fetch HTML once and capture performance metrics
            self._fetch_html()
            
            # Run all analyzers - pass pre-fetched html_content to save time
            performance = PerformanceAnalyzer(
                self.url, 
                self.html_content, 
                response_time_ms=self.performance_metrics.get('response_time_ms'),
                page_load_time_ms=self.performance_metrics.get('page_load_time_ms')
            ).analyze()
            seo = SEOAnalyzer(self.url, self.html_content).analyze()
            links = LinkAnalyzer(self.url, self.html_content).analyze()
            images = ImageAnalyzer(self.url, self.html_content).analyze()
            security = SecurityAnalyzer(self.url).analyze()
            mobile = MobileAnalyzer(self.html_content).analyze()
            
            # Combine results
            analysis_duration = time.time() - self.start_time
            
            audit_result = {
                'url': self.url,
                'domain': self.domain,
                'analysis_duration_seconds': analysis_duration,
                'performance': performance,
                'seo': seo,
                'links': links,
                'images': images,
                'security': security,
                'mobile': mobile,
            }
            
            # Return analysis without saving to database
            return audit_result
            
        except Exception as e:
            raise
    
    def _fetch_html(self):
        """Fetch HTML content once and capture performance metrics."""
        try:
            fetch_start = time.time()
            
            response = requests.get(
                self.url,
                timeout=10,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            
            fetch_time = time.time() - fetch_start
            page_size_bytes = len(response.content)
            
            # Use response.elapsed as the single source of truth for timing
            response_time_ms = int(response.elapsed.total_seconds() * 1000) if response.elapsed else int(fetch_time * 1000)
            
            # Store metrics for later use
            self.performance_metrics = {
                'response_time_ms': response_time_ms,
                'page_load_time_ms': response_time_ms,
                'page_size_mb': round(page_size_bytes / (1024 * 1024), 2),
                'page_size_bytes': page_size_bytes,
                'status_code': response.status_code,
            }
            
            self.html_content = response.content
        except Exception as e:
            raise Exception(f"Failed to fetch {self.url}: {str(e)}")
    

