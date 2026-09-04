(() => {
    document.body.classList.add('js-ready');

    /* ── app loading overlay ── */
    (function initAppLoading() {
        if (document.getElementById('appLoading')) return;
        var el = document.createElement('div');
        el.id = 'appLoading';
        el.className = 'app-loading';
        el.innerHTML = '<div class="app-loading-spinner"></div>';
        (document.body || document.documentElement).appendChild(el);
        var hide = function () {
            el.classList.add('is-hidden');
            setTimeout(function () { el.remove(); }, 400);
        };
        if (document.readyState === 'complete') { hide(); return; }
        window.addEventListener('load', hide, { once: true });
        setTimeout(hide, 2000);
    })();

    /* ── code tabs (fallback, kept for any code panel on page) ── */
    const tabs = document.querySelectorAll('[data-code-tab]');
    const panels = document.querySelectorAll('[data-code-panel]');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const selected = tab.dataset.codeTab;
            tabs.forEach((item) => item.classList.toggle('active', item === tab));
            panels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.codePanel !== selected));
        });
    });

    /* ── copy buttons ── */
    const COPY_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    const TICK_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    document.querySelectorAll('[data-copy]').forEach((button) => {
        const original = button.innerHTML;
        button.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(button.dataset.copy);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = button.dataset.copy;
                    textarea.setAttribute('readonly', '');
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-9999px';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    textarea.remove();
                }
                button.innerHTML = TICK_ICON;
                window.setTimeout(() => { button.innerHTML = original; }, 900);
            } catch (error) { button.innerHTML = original; }
        });
    });

    /* ── scroll progress ── */
    const scrollProgress = document.getElementById('scrollProgress');
    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    /* ── TOC: collapse + active highlight ── */
    const toc = document.getElementById('toc');
    const tocOpen = document.getElementById('tocOpen');
    const tocClose = document.getElementById('tocClose');
    const tocList = toc ? toc.querySelector('.toc-list') : null;
    const tocItems = Array.from(document.querySelectorAll('.toc-item[data-toc]'));
    const tocSections = tocItems.map((item) => document.getElementById(item.dataset.toc)).filter(Boolean);

    if (toc && tocOpen && tocClose) {
        const collapse = (collapsed) => {
            toc.classList.toggle('is-collapsed', collapsed);
            tocOpen.classList.toggle('is-visible', collapsed);
            try { localStorage.setItem('toc-collapsed', collapsed ? '1' : '0'); } catch (_) {}
        };
        try { if (localStorage.getItem('toc-collapsed') === '1') collapse(true); } catch (_) {}
        tocClose.addEventListener('click', () => collapse(true));
        tocOpen.addEventListener('click', () => collapse(false));
    }

    const slideIndicator = (item) => {
        if (!tocList || !item) return;
        tocList.style.setProperty('--toc-active-y', Math.round(item.offsetTop) + 'px');
        tocList.style.setProperty('--toc-h', Math.round(item.offsetHeight) + 'px');
        tocList.style.setProperty('--toc-w', Math.round(item.offsetWidth) + 'px');
        tocList.style.setProperty('--toc-x', Math.round(item.offsetLeft) + 'px');
        tocList.classList.add('has-active');
    };

    (function injectIndicatorPatch() {
        const style = document.createElement('style');
        style.textContent = `
.toc-list::before {
    height: var(--toc-h, 36px);
    width: var(--toc-w, calc(100% - 8px));
    left: var(--toc-x, 4px);
}`;
        document.head.appendChild(style);
    })();

    const setActiveItem = (id) => {
        let active = null;
        tocItems.forEach((item) => {
            const on = item.dataset.toc === id;
            item.classList.toggle('is-active', on);
            if (on) active = item;
        });
        slideIndicator(active);
    };

    if (tocSections.length && 'IntersectionObserver' in window) {
        const visible = new Map();
        const observer = new IntersectionObserver((entries) => {
            if (tocList && tocList.classList.contains('toc-nav-lock')) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
                else visible.delete(entry.target.id);
            });
            if (visible.size) {
                const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
                setActiveItem(top);
            }
        }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
        tocSections.forEach((section) => observer.observe(section));
    }

    requestAnimationFrame(() => {
        const first = tocItems.find((it) => it.classList.contains('is-active')) || tocItems[0];
        if (first) slideIndicator(first);
    });
    window.addEventListener('resize', () => {
        const cur = tocItems.find((it) => it.classList.contains('is-active'));
        if (cur) slideIndicator(cur);
    });

    tocItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const target = document.getElementById(item.dataset.toc);
            if (!target) return;
            e.preventDefault();
            target.classList.remove('toc-target-anim');
            void target.offsetWidth;
            target.classList.add('toc-target-anim');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveItem(item.dataset.toc);
            history.replaceState(null, '', '#' + item.dataset.toc);
            // 平滑滚动期间锁定 scroll-spy, 避免滑块被连续打断产生抖动
            tocList.classList.add('toc-nav-lock');
            let fallback = null;
            const unlock = () => {
                tocList.classList.remove('toc-nav-lock');
                window.removeEventListener('scrollend', unlock);
                if (fallback) clearTimeout(fallback);
            };
            window.addEventListener('scrollend', unlock, { once: true });
            fallback = setTimeout(unlock, 800);
        });
    });

    /* ── visits (local mock via /api/visits) ── */
    const fmtNum = (n) => (n === null || n === undefined ? '—' : Number(n).toLocaleString('en-US'));
    const visitsBadge = document.getElementById('visitsBadge');
    const visitsToday = document.getElementById('visitsToday');
    const visitsTotal = document.getElementById('visitsTotal');
    const visitsOnline = document.getElementById('visitsOnline');
    const visitsOnlineHero = document.getElementById('visitsOnlineHero');
    const visitorLocation = document.getElementById('visitorLocation');

    const applyLocation = (location) => {
        if (!visitorLocation || !location) return;
        const parts = [];
        if (location.country && location.country !== '0') parts.push(location.country);
        if (location.province && location.province !== '0') parts.push(location.province);
        if (location.city && location.city !== '0') parts.push(location.city);
        visitorLocation.textContent = parts.length ? parts.join(' · ') : '未知';
    };

    const applyVisits = (data) => {
        if (!data) return;
        if (visitsToday && data.today !== undefined) visitsToday.textContent = fmtNum(data.today);
        if (visitsTotal && data.total !== undefined) visitsTotal.textContent = fmtNum(data.total);
        if (visitsOnline && data.online !== undefined) visitsOnline.textContent = fmtNum(data.online);
        if (visitsOnlineHero && data.online !== undefined) visitsOnlineHero.textContent = fmtNum(data.online);
        if (data.location) applyLocation(data.location);
        if (visitsBadge) visitsBadge.classList.add('is-ready');
    };

    let visitsFetchInFlight = false;
    let visitsCounted = false;
    const loadVisits = () => {
        if (visitsFetchInFlight) return;
        visitsFetchInFlight = true;
        const url = visitsCounted ? '/api/visits?peek=1' : '/api/visits';
        fetch(url, { cache: 'no-store' })
            .then((r) => r.ok ? r.json() : Promise.reject(r.status))
            .then((json) => { visitsCounted = true; applyVisits(json && json.data); })
            .catch(() => {})
            .finally(() => { visitsFetchInFlight = false; });
    };
    if (visitsBadge) visitsBadge.classList.add('is-ready');
    loadVisits();
    setInterval(loadVisits, 5000);

    const SID_KEY = 'visits-sid';
    let sid = '';
    try { sid = sessionStorage.getItem(SID_KEY) || ''; } catch (_) {}
    if (!sid) {
        sid = (window.crypto && window.crypto.randomUUID)
            ? crypto.randomUUID()
            : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        try { sessionStorage.setItem(SID_KEY, sid); } catch (_) {}
    }
    const beat = () => {
        if (document.hidden) return;
        fetch('/api/visits/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sid }),
            keepalive: true,
        }).catch(() => {});
    };
    beat();
    setInterval(beat, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) beat(); });
})();
