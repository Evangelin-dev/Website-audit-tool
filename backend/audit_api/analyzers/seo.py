import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Tuple


class SEOAnalyzer:
    """Analyzes SEO metadata and structure from real website."""
    
    def __init__(self, url: str, html_content: str = None):
        self.url = url
        self.domain = urlparse(url).netloc
        self.html_content = html_content
        self.soup = None
        
    def fetch_content(self):
        """Fetch HTML content if not provided."""
        if self.html_content is None:
            try:
                response = requests.get(
                    self.url,
                    timeout=10,
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                )
                self.html_content = response.content
            except Exception as e:
                return {'error': str(e)}
        
        self.soup = BeautifulSoup(self.html_content, 'html.parser')
        return None

    def analyze(self) -> Dict:
        """Perform comprehensive SEO analysis."""
        if self.fetch_content():
            return {'error': 'Failed to fetch content'}

        return {
            'title': self._get_title(),
            'title_length': self._get_title_length(),
            'meta_description': self._get_meta_description(),
            'meta_description_length': self._get_meta_description_length(),
            'h1_count': len(self.soup.find_all('h1')),
            'h2_count': len(self.soup.find_all('h2')),
            'h1_tags': [h1.get_text(strip=True) for h1 in self.soup.find_all('h1')[:5]],
            'canonical_tag': self._get_canonical(),
            'robots_meta_tag': self._get_robots_meta(),
            'og_title': self._get_og_tag('og:title'),
            'og_description': self._get_og_tag('og:description'),
            'og_image': self._get_og_tag('og:image'),
            'twitter_card': self._get_twitter_card(),
            'lang_attribute': self._get_lang_attribute(),
            'sitemap_exists': self._check_sitemap(),
            'sitemap_url': self._get_sitemap_url(),
            'robots_txt_exists': self._check_robots_txt(),
        }

    def _get_title(self) -> str:
        title_tag = self.soup.find('title')
        return title_tag.get_text(strip=True) if title_tag else ''

    def _get_title_length(self) -> int:
        return len(self._get_title())

    def _get_meta_description(self) -> str:
        meta = self.soup.find('meta', attrs={'name': 'description'})
        return meta.get('content', '') if meta else ''

    def _get_meta_description_length(self) -> int:
        return len(self._get_meta_description())

    def _get_canonical(self) -> str:
        canonical = self.soup.find('link', attrs={'rel': 'canonical'})
        return canonical.get('href', '') if canonical else ''

    def _get_robots_meta(self) -> str:
        robots = self.soup.find('meta', attrs={'name': 'robots'})
        return robots.get('content', '') if robots else ''

    def _get_og_tag(self, property_name: str) -> str:
        og = self.soup.find('meta', attrs={'property': property_name})
        return og.get('content', '') if og else ''

    def _get_twitter_card(self) -> Dict:
        twitter_card = self.soup.find('meta', attrs={'name': 'twitter:card'})
        twitter_title = self.soup.find('meta', attrs={'name': 'twitter:title'})
        twitter_description = self.soup.find('meta', attrs={'name': 'twitter:description'})
        
        return {
            'card': twitter_card.get('content', '') if twitter_card else '',
            'title': twitter_title.get('content', '') if twitter_title else '',
            'description': twitter_description.get('content', '') if twitter_description else ''
        }

    def _get_lang_attribute(self) -> str:
        html_tag = self.soup.find('html')
        return html_tag.get('lang', '') if html_tag else ''

    def _check_sitemap(self) -> bool:
        try:
            base_url = f"{urlparse(self.url).scheme}://{self.domain}"
            sitemap_url = f"{base_url}/sitemap.xml"
            response = requests.head(sitemap_url, timeout=5)
            return response.status_code == 200
        except:
            return False

    def _check_robots_txt(self) -> bool:
        try:
            base_url = f"{urlparse(self.url).scheme}://{self.domain}"
            robots_url = f"{base_url}/robots.txt"
            response = requests.head(robots_url, timeout=5)
            return response.status_code == 200
        except:
            return False

    def _get_sitemap_url(self) -> str:
        if self._check_sitemap():
            base_url = f"{urlparse(self.url).scheme}://{self.domain}"
            return f"{base_url}/sitemap.xml"
        return ''
