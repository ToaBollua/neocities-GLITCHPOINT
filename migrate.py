import os
import re

files_to_migrate = [
    "thread_runtime.html",
    "thread_voyager.html",
    "thread_drone.html",
    "thread_kotlin.html",
    "thread_cloud.html"
]

template_path = "TEMPLATE_THREAD.html"
with open(template_path, "r", encoding="utf-8") as f:
    template = f.read()

for filename in files_to_migrate:
    if not os.path.exists(filename):
        continue
        
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()

    # Extract Title from <h1> or <title>
    title_match = re.search(r'<h1>(.*?)</h1>', html)
    if not title_match:
        title_match = re.search(r'<title>(.*?)</title>', html)
    title = title_match.group(1).replace('GLITCHPOINT // ', '') if title_match else filename
    
    # Extract Author, Date, Tags
    header_match = re.search(r'<strong>AUTHOR:</strong>(.*?)<br|<strong>AUTHOR:</strong>(.*?)</div>', html, re.DOTALL)
    author = "ToaBollua"
    date = "2026-01-01"
    tags = "N/A"
    if header_match:
        header_text = header_match.group(1) or header_match.group(2)
        if "DATE:" in header_text:
            date_match = re.search(r'DATE:</strong>([^|]+)', header_text)
            if date_match: date = date_match.group(1).strip()
        if "TAGS:" in header_text:
            tags_match = re.search(r'TAGS:</strong>(.*)', header_text)
            if tags_match: tags = tags_match.group(1).strip()
    
    # Extract Post Content (everything in first post after post-header)
    post_match = re.search(r'<div class="post">(.*?)</div>\s*<div class="post', html, re.DOTALL)
    if not post_match:
        post_match = re.search(r'<div class="post">(.*?)</div>\s*</body>', html, re.DOTALL)
    
    content_html = ""
    if post_match:
        content_html = post_match.group(1)
        # remove post-header part
        content_html = re.sub(r'<div class="post-header">.*?</div>', '', content_html, flags=re.DOTALL)
        
    # Extract H0P3 content
    h0p3_match = re.search(r'<div class="post reply-h0p3">(.*?)</div>', html, re.DOTALL)
    h0p3_status = "ACTIVE"
    h0p3_content = ""
    if h0p3_match:
        h0p3_raw = h0p3_match.group(1)
        status_match = re.search(r'STATUS:</strong>(.*?)\n', h0p3_raw) or re.search(r'STATUS:</strong>(.*?)</div>', h0p3_raw)
        if status_match:
            h0p3_status = status_match.group(1).strip()
        h0p3_content = re.sub(r'<div class="post-header">.*?</div>', '', h0p3_raw, flags=re.DOTALL)
    
    # Render template
    new_html = template.replace("[TITLE]", title)
    new_html = new_html.replace("[AUTHOR]", author)
    new_html = new_html.replace("[DATE]", date)
    new_html = new_html.replace("[TAGS]", tags)
    new_html = new_html.replace("[CONTENT_HTML]", content_html.strip())
    new_html = new_html.replace("[STATUS]", h0p3_status)
    new_html = new_html.replace("[H0P3_COMMENT_HTML]", h0p3_content.strip())
    
    # Write back
    with open(filename, "w", encoding="utf-8") as f:
        f.write(new_html)
        print(f"Migrated {filename}")
