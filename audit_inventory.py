import os
import json
import re

base_dir = r"C:\Users\18086\.workspace\git-workspace\6767-tools"
pages_dir = os.path.join(base_dir, "pages")
html_files = [f for f in os.listdir(pages_dir) if f.endswith(".html")]

changelog_path = os.path.join(base_dir, "EXTENDED_TOOLS_CHANGELOG.md")
with open(changelog_path, "r", encoding="utf-8") as f:
    cl_text = f.read()

new_tools = set(re.findall(r"`pages/([^`]+)\.html`", cl_text))

cdn_tainted = []
fake_apps = []
unicode_trivial = []
catalog = []

for f in sorted(html_files):
    code = f.replace(".html", "")
    fpath = os.path.join(pages_dir, f)
    with open(fpath, "r", encoding="utf-8", errors="ignore") as fp:
        content = fp.read()
    
    # 提取标题
    title_match = re.search(r"<title>(.*?)</title>", content, re.IGNORECASE)
    title = title_match.group(1).split("-")[0].strip() if title_match else code

    # 检测外链 CDN
    cdns = re.findall(r"https?://[^\s\"\'\<\>]+(?:cdn|unpkg|jsdelivr|cloudflare|bootcdn|googleapis)[^\s\"\'\<\>]*", content)
    if cdns:
        cdn_tainted.append((code, cdns))

    # 检测纯引流的假桌面客户端页面
    if code.endswith("-app") or "桌面应用程序" in title or "客户端下载" in content:
        fake_apps.append(code)

    # 检测单一低质的 Unicode 文本小工具
    if any(k in code for k in ["underline", "bold-text", "italic-text", "strikethrough", "mirror-text", "upside-down", "reverse-text"]):
        unicode_trivial.append(code)

    is_untrusted_new = code in new_tools

    catalog.append({
        "code": code,
        "title": title,
        "file": f,
        "is_untrusted_new": is_untrusted_new,
        "is_fake_app": code in fake_apps,
        "is_trivial": code in unicode_trivial,
        "cdn_count": len(cdns)
    })

print(f"Total HTML pages in pages/: {len(html_files)}")
print(f"新方案纳入工具 (marked as UNTRUSTED for re-audit): {len([c for c in catalog if c['is_untrusted_new']])}")
print(f"外链 CDN 污染页面 (违背全离线规范，必须本地化): {len(cdn_tainted)}")
print(f"假应用/引流死链接页面 (建议直接废弃/删除): {len(fake_apps)}")
print(f"极简无意义单一 Unicode 文本小工具: {len(unicode_trivial)}")

# 导出清单报告
out_json = os.path.join(base_dir, "tools_audit_manifest.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump({
        "total_pages": len(html_files),
        "untrusted_new_tools": [c["code"] for c in catalog if c["is_untrusted_new"]],
        "fake_apps_to_delete": fake_apps,
        "trivial_tools_to_consolidate": unicode_trivial,
        "cdn_tainted_tools": [c[0] for c in cdn_tainted],
        "all_catalog": catalog
    }, f, indent=2, ensure_ascii=False)

print(f"Saved full inventory audit to: {out_json}")
