import re
import html
from typing import Dict, Any, List, Optional
from pathlib import Path
import requests

try:
    import docx
except ImportError:
    docx = None

try:
    import pypdf
except ImportError:
    pypdf = None

def clean_text(text: str) -> str:
    """Clean and normalize extracted text."""
    if not text:
        return ""
    # Unescape HTML entities
    text = html.unescape(text)
    # Normalize unicode spaces and dashes
    text = re.sub(r'[\u200b\u200c\u200d\uFEFF]', '', text)
    text = re.sub(r'[\u2010\u2011\u2012\u2013\u2014\u2015]', '-', text)
    text = re.sub(r'[\u2018\u2019\u201b]', "'", text)
    text = re.sub(r'[\u201c\u201d\u201f]', '"', text)
    # Replace multiple whitespace with single space, preserve paragraphs
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.splitlines()]
    # Group into clean paragraphs
    cleaned = "\n".join([line for line in lines if line])
    return cleaned

def extract_text_from_txt(file_bytes: bytes) -> str:
    """Extract text from plain text or markdown bytes."""
    for enc in ['utf-8', 'latin-1', 'cp1252']:
        try:
            return file_bytes.decode(enc)
        except UnicodeDecodeError:
            continue
    return file_bytes.decode('utf-8', errors='ignore')

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from docx file bytes."""
    if not docx:
        # Fallback if docx module not available: scan XML strings
        import zipfile
        import io
        import xml.etree.ElementTree as ET
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                xml_content = z.read('word/document.xml')
                tree = ET.fromstring(xml_content)
                namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                texts = [node.text for node in tree.findall('.//w:t', namespaces) if node.text]
                return "\n".join(texts)
        except Exception as e:
            return f"Error extracting DOCX: {str(e)}"

    import io
    doc = docx.Document(io.BytesIO(file_bytes))
    full_text = []
    for para in doc.paragraphs:
        if para.text.strip():
            full_text.append(para.text.strip())
    for table in doc.tables:
        for row in table.rows:
            row_data = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_data:
                full_text.append(" | ".join(row_data))
    return "\n\n".join(full_text)

def extract_text_from_pdf(file_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Extract text per page from PDF bytes.
    Returns list of dicts: [{"page": page_num, "text": page_text}]
    """
    pages_data = []
    if pypdf:
        import io
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                cleaned = clean_text(text)
                if cleaned:
                    pages_data.append({"page": i + 1, "text": cleaned})
            if pages_data:
                return pages_data
        except Exception:
            pass

    # Pure Python stream fallback if pypdf fails or not available
    try:
        import io
        import zlib
        content = file_bytes
        # Search for FlateDecode streams
        stream_regex = re.compile(rb'stream[\r\n]+(.*?)[\r\n]+endstream', re.DOTALL)
        found_streams = stream_regex.findall(content)
        all_text = []
        for stream in found_streams:
            try:
                decompressed = zlib.decompress(stream)
                # Extract BT ... ET text blocks or strings in parentheses
                str_matches = re.findall(rb'\(([^\(\)\\]*(?:\\.[^\(\)\\]*)*)\)\s*T[jJ]', decompressed)
                if str_matches:
                    decoded = [s.decode('latin1', errors='ignore') for s in str_matches]
                    all_text.append(" ".join(decoded))
            except Exception:
                continue
        if all_text:
            cleaned = clean_text(" ".join(all_text))
            if cleaned:
                return [{"page": 1, "text": cleaned}]
    except Exception:
        pass

    # If all parsing fails, try UTF-8/ASCII printable characters
    printable = "".join([chr(b) for b in file_bytes if 32 <= b <= 126 or b in (10, 13)])
    cleaned = clean_text(printable[:10000])
    return [{"page": 1, "text": cleaned if cleaned else "PDF content parsed."}]

def extract_text_from_url(url: str, timeout: int = 12) -> Dict[str, Any]:
    """Fetch and extract clean text from a web URL."""
    headers = {
        'User-Agent': 'OrganicFarmingAssistant/1.0 (Agricultural Research & Education RAG Pipeline)'
    }
    resp = requests.get(url, headers=headers, timeout=timeout)
    resp.raise_for_status()
    html_content = resp.text

    # Basic clean extraction of title and body text
    title_match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE | re.DOTALL)
    title = clean_text(title_match.group(1)) if title_match else url

    # Remove script and style tags
    clean_html = re.sub(r'<(script|style|noscript|header|footer|nav)[^>]*>.*?</\1>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
    # Remove all HTML tags
    text = re.sub(r'<[^>]+>', ' ', clean_html)
    cleaned = clean_text(text)

    return {
        "title": title,
        "content": cleaned,
        "source_url": url
    }
