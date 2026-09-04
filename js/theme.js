/**
 * ═══════════════════════════════════════════════════════════════
 * theme.js — 在线工具集 全局日夜间模式 (Day / Night Theme Engine)
 * ═══════════════════════════════════════════════════════════════
 * 支持特性:
 * 1. 毫秒级防白屏/防闪烁 (Zero-FOUC Early Bootstrap)
 * 2. 状态持久化 (localStorage: 6767_theme)
 * 3. 跟随系统 (System prefers-color-scheme 响应)
 * 4. 多标签页实时双向同态同步 (Cross-tab sync via StorageEvent)
 * 5. visitsBadge 与顶栏纯图标极简集成 (Icon-only Merge)
 * 6. 全局事件总线 (themechange CustomEvent)
 */

(function () {
    'use strict';

    var STORAGE_KEY = '6767_theme';
    var LEGACY_KEY = 'theme';

    var SUN_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    var MOON_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

    function getStoredTheme() {
        try {
            var v = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
            if (v === 'dark' || v === 'light') return v;
        } catch (e) {}
        return null;
    }

    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark'; // 默认夜间模式为基准
    }

    function getActiveTheme() {
        return getStoredTheme() || getSystemTheme();
    }

    function applyTheme(theme, save) {
        var isDark = theme === 'dark';
        var docEl = document.documentElement;

        if (isDark) {
            docEl.classList.add('dark');
            docEl.setAttribute('data-theme', 'dark');
            docEl.style.colorScheme = 'dark';
        } else {
            docEl.classList.remove('dark');
            docEl.setAttribute('data-theme', 'light');
            docEl.style.colorScheme = 'light';
        }

        if (save) {
            try {
                localStorage.setItem(STORAGE_KEY, theme);
                localStorage.setItem(LEGACY_KEY, theme);
            } catch (e) {}
        }

        updateAllToggleButtons(theme);

        try {
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme, isDark: isDark } }));
        } catch (e) {}
    }

    function toggleTheme() {
        var current = getActiveTheme();
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        return next;
    }

    function updateAllToggleButtons(theme) {
        var isDark = theme === 'dark';
        var buttons = document.querySelectorAll('.theme-toggle-btn');
        buttons.forEach(function (btn) {
            var iconEl = btn.querySelector('.theme-toggle-icon') || btn;
            // 当处于夜间模式时，显示太阳图标（提示切换为日间）；当处于日间模式时，显示月亮图标（提示切换为夜间）
            iconEl.innerHTML = isDark ? SUN_ICON : MOON_ICON;
            btn.setAttribute('title', isDark ? '切换至日间模式 (Light Mode)' : '切换至夜间模式 (Dark Mode)');
            btn.setAttribute('aria-label', isDark ? '切换至日间模式' : '切换至夜间模式');
            btn.setAttribute('data-current-theme', theme);
        });
    }

    function createToggleButton(extraClass) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle-btn icon-only' + (extraClass ? ' ' + extraClass : '');
        var current = getActiveTheme();
        var isDark = current === 'dark';

        btn.innerHTML = '<span class="theme-toggle-icon">' + (isDark ? SUN_ICON : MOON_ICON) + '</span>';
        btn.setAttribute('title', isDark ? '切换至日间模式 (Light Mode)' : '切换至夜间模式 (Dark Mode)');
        btn.setAttribute('aria-label', isDark ? '切换至日间模式' : '切换至夜间模式');
        btn.setAttribute('data-current-theme', current);

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });

        return btn;
    }

    function mountThemeButtons() {
        // 1. 在首页 siteTopActions 中挂载（位于语言切换与访问胶囊之间）
        var siteTopActions = document.getElementById('siteTopActions');
        if (siteTopActions && !siteTopActions.querySelector('.theme-toggle-btn')) {
            var homeBtn = createToggleButton('home-theme-toggle');
            var visitsBadge = siteTopActions.querySelector('#visitsBadge, .visits-badge');
            if (visitsBadge) {
                siteTopActions.insertBefore(homeBtn, visitsBadge);
            } else {
                siteTopActions.appendChild(homeBtn);
            }
        }

        // 清理任何历史遗留的独立首页胶囊
        var oldHomeBtn = document.getElementById('homeThemeToggle');
        if (oldHomeBtn) oldHomeBtn.remove();

        // 2. 在工具页顶栏 tool-topbar 中挂载（纯 icon）
        var topbars = document.querySelectorAll('.tool-topbar');
        topbars.forEach(function (topbar) {
            if (topbar.querySelector('.theme-toggle-btn')) return;
            var homeLink = topbar.querySelector('.tool-topbar-home');
            var btn = createToggleButton('topbar-theme-toggle');
            if (homeLink) {
                topbar.insertBefore(btn, homeLink);
            } else {
                topbar.appendChild(btn);
            }
        });

        // 3. 在分类页 hero 区域补充挂载
        var catHero = document.querySelector('.cat-hero');
        if (catHero && !catHero.querySelector('.theme-toggle-btn')) {
            var actions = catHero.querySelector('.cat-actions') || catHero;
            var catBtn = createToggleButton('cat-theme-toggle');
            actions.appendChild(catBtn);
        }

        // 更新状态
        updateAllToggleButtons(getActiveTheme());
    }

    // ── Early Bootstrap (立即执行，防止首屏闪白/闪黑) ──
    var initialTheme = getActiveTheme();
    applyTheme(initialTheme, false);

    // ── 监听系统偏好变化 ──
    if (window.matchMedia) {
        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        var onMediaChange = function (e) {
            if (!getStoredTheme()) {
                applyTheme(e.matches ? 'dark' : 'light', false);
            }
        };
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', onMediaChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(onMediaChange);
        }
    }

    // ── 多标签页同步 ──
    window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY || e.key === LEGACY_KEY) {
            var newTheme = e.newValue;
            if (newTheme === 'dark' || newTheme === 'light') {
                applyTheme(newTheme, false);
            }
        }
    });

    // ── DOM 就绪时挂载 UI ──
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountThemeButtons);
    } else {
        mountThemeButtons();
    }

    // ── 暴露全局 API ──
    window.__getTheme = getActiveTheme;
    window.__setTheme = function (theme) { applyTheme(theme, true); };
    window.__mountThemeButtons = mountThemeButtons;
    window.__toggleTheme = toggleTheme;
    window.__mountThemeUI = mountThemeButtons;

})();
