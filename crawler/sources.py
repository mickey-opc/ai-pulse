from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Callable, List
import os
import re

import requests
from bs4 import BeautifulSoup


@dataclass
class Article:
    title: str
    url: str
    source: str
    summary: str
    publishedAt: str


def _clean_html(value: str) -> str:
    text = BeautifulSoup(value or "", "lxml").get_text(" ", strip=True)
    return re.sub(r"\s+", " ", text).strip()


def _parse_date(value: str | None) -> str:
    if not value:
        return datetime.now(timezone.utc).isoformat()
    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError):
        return datetime.now(timezone.utc).isoformat()


def _fetch_rss(url: str, source: str) -> List[Article]:
    response = requests.get(url, timeout=20, headers={"User-Agent": "AI Pulse Bot/1.0"})
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "xml")
    items = []
    for item in soup.find_all("item")[:8]:
        title = _clean_html(item.title.text if item.title else "Untitled")
        link = item.link.text.strip() if item.link else ""
        description = _clean_html(item.description.text if item.description else "")
        pub_date = _parse_date(item.pubDate.text if item.pubDate else None)
        if title and link:
            items.append(
                Article(
                    title=title,
                    url=link,
                    source=source,
                    summary=description[:280],
                    publishedAt=pub_date,
                )
            )
    return items


def _title_from_slug(slug: str) -> str:
    return " ".join(part.capitalize() for part in slug.split("-"))


def fetch_openai() -> List[Article]:
    return _fetch_rss("https://openai.com/news/rss.xml", "openai")


def fetch_anthropic() -> List[Article]:
    response = requests.get("https://www.anthropic.com/news", timeout=20, headers={"User-Agent": "AI Pulse Bot/1.0"})
    response.raise_for_status()
    slugs = []
    for slug in re.findall(r"/news/([a-z0-9-]+)", response.text):
        if slug != "not-found" and slug not in slugs:
            slugs.append(slug)

    items = []
    for slug in slugs[:8]:
        url = f"https://www.anthropic.com/news/{slug}"
        try:
            article_response = requests.get(url, timeout=20, headers={"User-Agent": "AI Pulse Bot/1.0"})
            article_response.raise_for_status()
            html = article_response.text
            title_match = re.search(r'<meta property="og:title" content="([^"]+)"', html)
            desc_match = re.search(r'<meta name="description" content="([^"]+)"', html)
            date_match = re.search(r'"datePublished":"([^"]+)"', html)
            items.append(
                Article(
                    title=_clean_html(title_match.group(1) if title_match else _title_from_slug(slug)),
                    url=url,
                    source="anthropic",
                    summary=_clean_html(desc_match.group(1) if desc_match else _title_from_slug(slug))[:280],
                    publishedAt=_parse_date(date_match.group(1) if date_match else None),
                )
            )
        except requests.RequestException:
            continue
    return items


def fetch_waytoagi() -> List[Article]:
    response = requests.get("https://www.waytoagi.com", timeout=20, headers={"User-Agent": "AI Pulse Bot/1.0"})
    response.raise_for_status()
    items = []
    matches = re.findall(
        r'<a[^>]+href="(https://blog\.waytoagi\.com/article/news-(\d{8}))"[^>]*>(.*?)</a>',
        response.text,
        re.S,
    )
    for url, date_code, content in matches[:8]:
        summary = _clean_html(content)
        published = f"{date_code[:4]}-{date_code[4:6]}-{date_code[6:8]}T08:00:00+00:00"
        items.append(
            Article(
                title=summary[:120] or f"WaytoAGI update {date_code}",
                url=url,
                source="waytoagi",
                summary=summary[:280],
                publishedAt=published,
            )
        )
    return items


def fetch_twitter() -> List[Article]:
    urls = os.getenv(
        "TWITTER_RSS_URLS",
        "https://nitter.poast.org/OpenAI/rss,https://xcancel.com/OpenAI/rss",
    ).split(",")
    for url in [item.strip() for item in urls if item.strip()]:
        try:
            return _fetch_rss(url, "twitter")
        except requests.RequestException:
            continue
    return []


SOURCES: dict[str, Callable[[], List[Article]]] = {
    "openai": fetch_openai,
    "anthropic": fetch_anthropic,
    "waytoagi": fetch_waytoagi,
    "twitter": fetch_twitter,
}


def fetch_all() -> List[dict]:
    results: List[dict] = []
    for name, fetcher in SOURCES.items():
        try:
            for article in fetcher():
                results.append(asdict(article))
        except Exception as exc:  # pragma: no cover
            print(f"[warn] source={name} error={exc}")
    return results
