"""
Web scraper utility for media content analysis
Extracts clean text from news articles and blog posts
"""

import requests
from bs4 import BeautifulSoup
from typing import Optional
import logging

logger = logging.getLogger(__name__)


def scrape_article(url: str, timeout: int = 10) -> Optional[str]:
    """
    Scrape article text from URL
    
    Args:
        url: Article URL to scrape
        timeout: Request timeout in seconds
        
    Returns:
        Cleaned article text or None if failed
    """
    try:
        # Set user agent to avoid blocking
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        # Fetch the page
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "aside"]):
            script.decompose()
        
        # Try to find article content
        article_text = ""
        
        # Common article containers
        article_selectors = [
            'article',
            '[role="article"]',
            '.article-content',
            '.post-content',
            '.entry-content',
            'main'
        ]
        
        for selector in article_selectors:
            article = soup.select_one(selector)
            if article:
                article_text = article.get_text(separator=' ', strip=True)
                break
        
        # Fallback to body if no article found
        if not article_text:
            article_text = soup.body.get_text(separator=' ', strip=True) if soup.body else ""
        
        # Clean up whitespace
        article_text = ' '.join(article_text.split())
        
        # Return first 2000 characters for analysis
        return article_text[:2000] if article_text else None
        
    except requests.RequestException as e:
        logger.error(f"Request error for {url}: {e}")
        return None
    except Exception as e:
        logger.error(f"Scraping error for {url}: {e}")
        return None


def extract_metadata(url: str) -> dict:
    """
    Extract metadata from article (title, description, etc.)
    
    Args:
        url: Article URL
        
    Returns:
        Dictionary with metadata
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        metadata = {
            'title': '',
            'description': '',
            'author': '',
            'published_date': ''
        }
        
        # Extract title
        if soup.title:
            metadata['title'] = soup.title.string
        
        # Extract meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            metadata['description'] = meta_desc.get('content', '')
        
        # Extract author
        meta_author = soup.find('meta', attrs={'name': 'author'})
        if meta_author:
            metadata['author'] = meta_author.get('content', '')
        
        return metadata
        
    except Exception as e:
        logger.error(f"Metadata extraction error: {e}")
        return {}
