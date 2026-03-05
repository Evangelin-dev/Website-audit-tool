import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, List
from concurrent.futures import ThreadPoolExecutor, as_completed


class ImageAnalyzer:
    """Analyzes all images in the website."""
    
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
        """Perform comprehensive image analysis."""
        if self.fetch_content():
            return {'error': 'Failed to fetch content'}

        images = self._extract_images()
        images_missing_alt = sum(1 for img in images if not img.get('alt'))
        
        # Check image status (with timeout)
        broken_images = self._check_images([img['url'] for img in images])
        
        return {
            'total_images': len(images),
            'broken_images_count': len(broken_images),
            'images_missing_alt_count': images_missing_alt,
            'broken_images': broken_images[:20],  # Limit to 20 for performance
            'images_sample': images[:10],  # Sample of images
        }

    def _extract_images(self) -> List[Dict]:
        """Extract all img tags and their attributes."""
        images = []
        for img in self.soup.find_all('img'):
            src = img.get('src', '')
            if not src:
                continue
            
            # Convert relative URLs to absolute
            if src.startswith('/'):
                full_url = f"{self.base_url}{src}"
            elif src.startswith('http'):
                full_url = src
            else:
                full_url = urljoin(self.base_url, src)
            
            images.append({
                'url': full_url,
                'alt': img.get('alt', ''),
                'title': img.get('title', ''),
            })
        
        return images

    def _check_images(self, urls: List[str], timeout: int = 5) -> List[Dict]:
        """Check status of all images with threading."""
        broken_images = []
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {executor.submit(self._check_image, url): url for url in urls}
            
            for future in as_completed(futures):
                try:
                    status_code, url = future.result()
                    if 400 <= status_code < 600 or status_code == 0:
                        broken_images.append({
                            'url': url,
                            'status_code': status_code
                        })
                except:
                    pass
        
        return broken_images

    def _check_image(self, url: str) -> tuple:
        """Check a single image status code."""
        try:
            response = self.session.head(
                url,
                timeout=5,
                allow_redirects=True,
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            return response.status_code, url
        except:
            return 0, url
