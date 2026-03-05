import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Tuple


class PerformanceAnalyzer:
    """Analyzes page performance metrics using real HTTP requests."""
    
    def __init__(self, url: str, html_content: bytes = None, response_time_ms: int = None, page_load_time_ms: int = None):
        self.url = url
        self.html_content = html_content
        self.response_time_ms = response_time_ms
        self.page_load_time_ms = page_load_time_ms
        self.session = requests.Session()

    def analyze(self) -> Dict:
        """Perform real performance analysis."""
        try:
            # If html_content is provided, use it; otherwise fetch fresh
            if self.html_content:
                # Use pre-fetched content
                soup = BeautifulSoup(self.html_content, 'html.parser')
                page_size_bytes = len(self.html_content)
                page_size_mb = round(page_size_bytes / (1024 * 1024), 2)
                
                # Count different types of resources
                script_count = len(soup.find_all('script'))
                link_count = len(soup.find_all('link'))
                img_count = len(soup.find_all('img'))
                iframe_count = len(soup.find_all('iframe'))
                total_requests = script_count + link_count + img_count + iframe_count
                
                return {
                    'response_time_ms': self.response_time_ms or 0,
                    'page_load_time_ms': self.page_load_time_ms or 0,
                    'page_size_mb': page_size_mb,
                    'page_size_bytes': page_size_bytes,
                    'total_requests': total_requests,
                    'scripts': script_count,
                    'stylesheets': link_count,
                    'images': img_count,
                    'iframes': iframe_count,
                    'status_code': 200
                }
            else:
                # Make real request
                start_time = time.time()
                
                response = self.session.get(
                    self.url,
                    timeout=10,
                    allow_redirects=True,
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                )
                
                elapsed_time = time.time() - start_time
                page_size_bytes = len(response.content)
                page_size_mb = round(page_size_bytes / (1024 * 1024), 2)
                response_time_ms = int(response.elapsed.total_seconds() * 1000)
                
                # Parse HTML to count different types of resources
                soup = BeautifulSoup(response.content, 'html.parser')
                script_count = len(soup.find_all('script'))
                link_count = len(soup.find_all('link'))
                img_count = len(soup.find_all('img'))
                iframe_count = len(soup.find_all('iframe'))
                total_requests = script_count + link_count + img_count + iframe_count
                
                return {
                    'response_time_ms': response_time_ms,
                    'page_load_time_ms': int(elapsed_time * 1000),
                    'page_size_mb': page_size_mb,
                    'page_size_bytes': page_size_bytes,
                    'total_requests': total_requests,
                    'scripts': script_count,
                    'stylesheets': link_count,
                    'images': img_count,
                    'iframes': iframe_count,
                    'status_code': response.status_code
                }
        except Exception as e:
            return {
                'error': str(e),
                'response_time_ms': 0,
                'page_load_time_ms': 0,
                'page_size_mb': 0,
                'page_size_bytes': 0,
                'total_requests': 0,
                'status_code': None
            }
