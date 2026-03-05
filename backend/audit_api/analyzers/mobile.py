from bs4 import BeautifulSoup
from typing import Dict


class MobileAnalyzer:
    """Analyzes mobile friendliness and responsive design."""
    
    def __init__(self, html_content: str):
        self.html_content = html_content
        self.soup = BeautifulSoup(html_content, 'html.parser')
    
    def analyze(self) -> Dict:
        """Perform mobile friendliness analysis."""
        return {
            'has_viewport_meta': self._check_viewport_meta(),
            'has_responsive_design': self._check_responsive_design(),
            'missing_lang_attribute': not self._check_lang_attribute(),
        }

    def _check_viewport_meta(self) -> bool:
        """Check if viewport meta tag is present."""
        viewport = self.soup.find('meta', attrs={'name': 'viewport'})
        return viewport is not None

    def _check_responsive_design(self) -> bool:
        """Check for responsive design indicators."""
        # Check for Bootstrap, Tailwind, or media queries
        html_str = str(self.soup)
        indicators = [
            'data-responsive',
            'viewport',
            '@media',
            'mobile-friendly',
        ]
        return any(indicator in html_str.lower() for indicator in indicators)

    def _check_lang_attribute(self) -> bool:
        """Check if html tag has lang attribute."""
        html_tag = self.soup.find('html')
        return html_tag is not None and html_tag.get('lang') is not None
