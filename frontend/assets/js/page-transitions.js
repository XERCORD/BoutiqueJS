/**
 * Navigation douce entre les pages HTML (sans rechargement complet).
 * Utilise l’API View Transitions quand elle est disponible + overlay thématique TCG.
 */
(function () {
    const HEADER_MARKER = 'header.css';
    let navigating = false;
    let overlayEl = null;

    function ensureOverlay() {
        if (overlayEl) return overlayEl;
        overlayEl = document.createElement('div');
        overlayEl.id = 'spa-transition-overlay';
        overlayEl.setAttribute('aria-hidden', 'true');
        overlayEl.innerHTML =
            '<div class="spa-overlay__duel-field"></div>' +
            '<div class="spa-overlay__burst"></div>' +
            '<div class="spa-overlay__lines"></div>' +
            '<div class="spa-overlay__sparkles"></div>';
        document.body.appendChild(overlayEl);
        return overlayEl;
    }

    function showOverlay() {
        const el = ensureOverlay();
        el.classList.add('spa-overlay--visible');
    }

    function hideOverlay() {
        if (overlayEl) overlayEl.classList.remove('spa-overlay--visible');
    }

    /**
     * @param {string} href URL complète ou relative
     * @returns {string} nom de fichier html (ex: allproducts.html)
     */
    function pageFileFromHref(href) {
        try {
            const u = new URL(href, window.location.href);
            const parts = u.pathname.split('/').filter(Boolean);
            const seg = parts.length ? parts[parts.length - 1] : '';
            if (!seg) return 'allproducts.html';
            return seg;
        } catch (e) {
            return '';
        }
    }

    /**
     * Enregistre l’init d’une page pour le premier chargement et les navigations SPA.
     * @param {string} filename ex: 'promotions.html'
     * @param {() => void} initFn
     */
    window.bindPage = function (filename, initFn) {
        function runIfMatch(href) {
            const f = pageFileFromHref(href);
            if (f === filename) {
                initFn();
            }
        }
        document.addEventListener('DOMContentLoaded', function () {
            runIfMatch(window.location.href);
        });
        window.addEventListener('spa:page-load', function (e) {
            if (e.detail && e.detail.url) {
                runIfMatch(e.detail.url);
            }
        });
    };

    function resetChromeUi() {
        document.querySelector('.menu-btn')?.classList.remove('active');
        document.querySelector('.menu')?.classList.remove('active');
        if (typeof window.updateCartBubble === 'function') {
            window.updateCartBubble();
        }
    }

    function syncStylesFromDocument(newDoc, pageBaseUrl) {
        const head = document.head;
        head.querySelectorAll('link[rel="stylesheet"][data-spa-swap]').forEach(function (el) {
            el.remove();
        });
        head.querySelectorAll('link[rel="stylesheet"][href]').forEach(function (link) {
            if (link.href.indexOf(HEADER_MARKER) === -1) {
                link.remove();
            }
        });

        newDoc.querySelectorAll('head link[rel="stylesheet"]').forEach(function (link) {
            const hrefAttr = link.getAttribute('href');
            if (!hrefAttr || hrefAttr.indexOf(HEADER_MARKER) !== -1) return;
            const abs = new URL(hrefAttr, pageBaseUrl).href;
            const clone = document.createElement('link');
            clone.rel = 'stylesheet';
            clone.href = abs;
            clone.setAttribute('data-spa-swap', '1');
            head.appendChild(clone);
        });
    }

    function isInternalHtmlLink(anchor) {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }
        if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
        if (href.indexOf('.html') === -1) return false;
        return true;
    }

    /**
     * @param {string} rawUrl
     * @param {{ skipPush?: boolean }} opts
     */
    window.__spaNavigate = function navigateTo(rawUrl, opts) {
        opts = opts || {};
        if (navigating) return Promise.resolve();
        navigating = true;

        const urlObj = new URL(rawUrl, window.location.href);
        const url = urlObj.href;

        const current = window.location.pathname + window.location.search + window.location.hash;
        const next = urlObj.pathname + urlObj.search + urlObj.hash;
        if (!opts.skipPush && current === next) {
            navigating = false;
            return Promise.resolve();
        }

        showOverlay();

        return fetch(url, { credentials: 'same-origin' })
            .then(function (res) {
                if (!res.ok) throw new Error('fetch failed');
                return res.text();
            })
            .then(function (html) {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const newMain = doc.querySelector('main');
                const newHeader = doc.querySelector('header');
                const newFooter = doc.querySelector('footer');
                if (!newMain || !newHeader || !newFooter) {
                    window.location.assign(url);
                    return Promise.resolve();
                }

                const doSwap = function () {
                    document.title = doc.title;
                    syncStylesFromDocument(doc, url);
                    var curMain = document.querySelector('main');
                    if (curMain) {
                        curMain.replaceWith(document.importNode(newMain, true));
                    }
                    if (!opts.skipPush) {
                        history.pushState({ spa: true }, '', urlObj.pathname + urlObj.search + urlObj.hash);
                    }
                    window.dispatchEvent(new CustomEvent('spa:page-load', { detail: { url: url } }));
                    resetChromeUi();
                };

                var hasVT = typeof document.startViewTransition === 'function';

                if (hasVT) {
                    return document
                        .startViewTransition(function () {
                            doSwap();
                        })
                        .finished.then(function () {
                            hideOverlay();
                        });
                }

                document.body.classList.add('spa-fallback-exit');
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        doSwap();
                        document.body.classList.remove('spa-fallback-exit');
                        document.body.classList.add('spa-fallback-enter');
                        hideOverlay();
                        setTimeout(function () {
                            document.body.classList.remove('spa-fallback-enter');
                            resolve();
                        }, 480);
                    }, 420);
                });
            })
            .catch(function () {
                hideOverlay();
                window.location.href = rawUrl;
            })
            .finally(function () {
                navigating = false;
            });
    };

    window.__spaSoftReload = function () {
        window.dispatchEvent(new CustomEvent('spa:page-load', { detail: { url: window.location.href } }));
    };

    document.addEventListener(
        'click',
        function (e) {
            var a = e.target.closest && e.target.closest('a[href]');
            if (!a || !isInternalHtmlLink(a)) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (e.button !== 0) return;
            var href = a.getAttribute('href');
            var resolved;
            try {
                resolved = new URL(href, window.location.href).href;
            } catch (err) {
                return;
            }
            if (new URL(resolved).origin !== window.location.origin) return;
            if (!document.querySelector('main')) return;
            e.preventDefault();
            window.__spaNavigate(resolved);
        },
        true
    );

    window.addEventListener('popstate', function () {
        window.__spaNavigate(window.location.href, { skipPush: true });
    });
})();
