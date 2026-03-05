import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed


class LinkAnalyzer:
    """Analyzes all links in the website including broken links and redirects."""
    
    def __init__(self, url: str, html_content: str = None):
        self.url = url
        self.domain = urlparse(url).netloc
        self.base_url = f"{urlparse(url).scheme}://{self.domain}"
        self.html_content = html_content
        self.soup = None
        self.session = requests.Session()
        
    def fetch_content(self):
        """Fetch HTML content if not provided."""
        if self.html_content is None:
            try:
                response = requests.get(
                    self.url,
                    timeout=10,
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                self.html_content = response.content
            except Exception as e:
                return {'error': str(e)}
        
        self.soup = BeautifulSoup(self.html_content, 'html.parser')
        return None

    def analyze(self) -> Dict:
        """Perform comprehensive link analysis."""
        if self.fetch_content():
            return {'error': 'Failed to fetch content'}

        links = self._extract_links()
        internal_links = [l for l in links if self._is_internal(l)]
        external_links = [l for l in links if not self._is_internal(l)]
        
        # Check link status (with timeout to avoid long waits)
        broken_links, redirects = self._check_links(links)
        
        return {
            'total_links': len(links),
            'internal_links': len(internal_links),
            'external_links': len(external_links),
            'broken_links_count': len(broken_links),
            'redirects_count': len(redirects),
            'broken_links': broken_links[:20],  # Limit to 20 for performance
            'redirects': redirects[:10],
        }

    def _extract_links(self) -> List[str]:
        """Extract all anchor links from the page."""
        links = []
        for a in self.soup.find_all('a', href=True):
            href = a['href']
            # Skip certain types of links
            if href.startswith(('#', 'tel:', 'mailto:', 'javascript:')):
                continue
            
            # Convert relative URLs to absolute
            if href.startswith('/'):
                full_url = f"{self.base_url}{href}"
            elif href.startswith('http'):
                full_url = href
            else:
                full_url = urljoin(self.base_url, href)
            
            links.append(full_url)
        
        return list(set(links))  # Remove duplicates

    def _is_internal(self, url: str) -> bool:
        """Check if URL is internal to the domain."""
        try:
            parsed = urlparse(url)
            return parsed.netloc == self.domain
        except:
            return False

    def _check_links(self, links: List[str], timeout: int = 5) -> Tuple[List, List]:
        """Check status of all links with threading."""
        broken_links = []
        redirects = []
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {executor.submit(self._check_link, url): url for url in links}
            
            for future in as_completed(futures):
                try:
                    status_code, url, location = future.result()
                    
                    if 400 <= status_code < 600:
                        broken_links.append({
                            'url': url,
                            'status_code': status_code
                        })
                    elif status_code in [301, 302, 303, 307, 308]:
                        redirects.append({
                            'url': url,
                            'status_code': status_code,
                            'location': location
                        })
                except:
                    pass
        
        return broken_links, redirects

    def _check_link(self, url: str) -> Tuple[int, str, str]:
        """Check a single link status code."""
        try:
            response = self.session.head(
                url,
                timeout=5,
                allow_redirects=False,
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            location = response.headers.get('Location', '')
            return response.status_code, url, location
        except requests.exceptions.Timeout:
            return 408, url, ''
        except:
            return 0, url, ''
