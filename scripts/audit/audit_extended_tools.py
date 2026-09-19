import os
import json
from playwright.sync_api import sync_playwright

TOOLS_TO_AUDIT = [
    ('sokoban', '推箱子'),
    ('2048', '2048游戏'),
    ('minesweeper', '扫雷游戏'),
    ('sudoku', '数独在线挑战'),
    ('pixel-art-maker', '像素画板'),
    ('bitwise-visualizer', '位运算可视化'),
    ('json-formatter', 'JSON格式化工具'),
    ('regex-tester', '正则表达式测试器'),
    ('base64-encoder-decoder', 'Base64编码解码'),
    ('contrast-checker', '无障碍色彩对比度检测'),
    ('css-glassmorphism', 'CSS毛玻璃生成器'),
    ('ascii-art-generator', 'ASCII字符画')
]

def run_extended_audit():
    os.makedirs('screenshots/extended_audit', exist_ok=True)
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        for slug, title in TOOLS_TO_AUDIT:
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            
            # Desktop dark mode
            page.goto(f'http://127.0.0.1:8093/{slug}', wait_until='networkidle')
            page.wait_for_timeout(500)
            page.screenshot(path=f'screenshots/extended_audit/{slug}_desktop_dark.png')
            
            # Switch to light mode
            page.evaluate('''() => {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                window.dispatchEvent(new Event('resize'));
            }''')
            page.wait_for_timeout(400)
            page.screenshot(path=f'screenshots/extended_audit/{slug}_desktop_light.png')
            
            # Contrast audit in light mode
            contrast_issues_light = page.evaluate('''() => {
                function parseColor(c) {
                    if (!c) return [255, 255, 255, 1];
                    const m = c.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
                    if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), m[4] !== undefined ? parseFloat(m[4]) : 1];
                    return [255, 255, 255, 1];
                }
                function lum(r, g, b) {
                    const a = [r, g, b].map(v => {
                        v /= 255;
                        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
                    });
                    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
                }
                function ratio(rgb1, rgb2) {
                    const l1 = lum(rgb1[0], rgb1[1], rgb1[2]);
                    const l2 = lum(rgb2[0], rgb2[1], rgb2[2]);
                    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
                }
                function getBg(el) {
                    let cur = el;
                    while (cur && cur !== document) {
                        const s = window.getComputedStyle(cur);
                        const b = parseColor(s.backgroundColor);
                        if (b[3] > 0.05) return b;
                        cur = cur.parentElement;
                    }
                    return [255, 255, 255, 1];
                }
                const bad = [];
                for (const el of document.querySelectorAll('*')) {
                    if (el.children.length > 0) continue;
                    const txt = (el.textContent || '').trim();
                    if (!txt || txt === '/') continue;
                    const rect = el.getBoundingClientRect();
                    if (rect.width === 0 || rect.height === 0) continue;
                    const s = window.getComputedStyle(el);
                    const fg = parseColor(s.color);
                    const bg = getBg(el);
                    const r = ratio(fg, bg);
                    if (r < 2.5) {
                        bad.push({
                            text: txt.slice(0, 20).replace(/[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]/g, ''),
                            tag: el.tagName,
                            ratio: r.toFixed(2),
                            fg: s.color,
                            bg: `rgb(${bg[0]},${bg[1]},${bg[2]})`
                        });
                    }
                }
                return bad;
            }''')
            
            # Mobile 375x812 check overflow
            m_page = browser.new_page(viewport={"width": 375, "height": 812})
            m_page.goto(f'http://127.0.0.1:8093/{slug}', wait_until='networkidle')
            m_page.wait_for_timeout(400)
            m_page.screenshot(path=f'screenshots/extended_audit/{slug}_mobile_dark.png')
            mobile_overflow = m_page.evaluate('''() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            }''')
            
            page.close()
            m_page.close()
            
            results.append({
                'slug': slug,
                'title': title,
                'errors': errors,
                'contrast_issues_count': len(contrast_issues_light),
                'contrast_samples': contrast_issues_light[:3],
                'mobile_overflow': mobile_overflow
            })
            
        browser.close()
        
    with open('extended_audit_report.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        
    print(f"EXTENDED_AUDIT_COMPLETE_COUNT: {len(results)}")

if __name__ == '__main__':
    run_extended_audit()
