import requests
from typing import Dict, List
from urllib.parse import urlparse


class SecurityAnalyzer:
    """Analyzes security headers and HTTPS configuration."""
    
    def __init__(self, url: str):
        self.url = url
        self.domain = urlparse(url).netloc
        
    def analyze(self) -> Dict:
        """Perform security analysis."""
        return {
            'https_enabled': self._check_https(),
            'ssl_grade': self._get_ssl_grade(),
            'security_headers': self._check_headers(),
        }

    def _check_https(self) -> bool:
        """Check if HTTPS is enabled."""
        return self.url.startswith('https://')

    def _get_ssl_grade(self) -> str:
        """Get SSL certificate grade (simplified)."""
        if not self._check_https():
            return 'N/A'
        
        try:
            response = requests.get(self.url, timeout=10, verify=True)
            return 'A'  # If we can connect with valid cert
        except requests.exceptions.SSLError:
            return 'F'
        except requests.exceptions.ConnectionError:
            return 'Unknown'
        except:
            return 'Unknown'

    def _check_headers(self) -> Dict[str, str]:
        """Check important security headers."""
        try:
            response = requests.head(
                self.url,
                timeout=10,
                headers={'User-Agent': 'Mozilla/5.0'},
                allow_redirects=True
            )
            
            headers = response.headers
            important_headers = {
                'Strict-Transport-Security': headers.get('Strict-Transport-Security', 'Missing'),
                'Content-Security-Policy': headers.get('Content-Security-Policy', 'Missing'),
                'X-Frame-Options': headers.get('X-Frame-Options', 'Missing'),
                'X-Content-Type-Options': headers.get('X-Content-Type-Options', 'Missing'),
                'X-XSS-Protection': headers.get('X-XSS-Protection', 'Missing'),
                'Referrer-Policy': headers.get('Referrer-Policy', 'Missing'),
                'Permissions-Policy': headers.get('Permissions-Policy', 'Missing'),
            }
            
            return important_headers
        except Exception as e:
            return {'error': str(e)}

    def get_missing_headers(self, headers: Dict) -> List[str]:
        """Get list of missing security headers."""
        missing = []
        for header, value in headers.items():
            if header != 'error' and value == 'Missing':
                missing.append(header)
        return missing
