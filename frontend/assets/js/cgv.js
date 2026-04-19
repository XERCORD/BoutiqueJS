/**
 * CGV : sommaire actif au scroll + ouverture de la section (details) au clic / hash
 */
(function () {
    var tocLinks = document.querySelectorAll('.cgv-toc a[href^="#"]');
    var contentRoot = document.querySelector('.cgv-content');
    if (!tocLinks.length || !contentRoot) return;

    var allDetails = contentRoot.querySelectorAll('details.cgv-details');

    function setActive(id) {
        tocLinks.forEach(function (a) {
            var href = a.getAttribute('href');
            a.classList.toggle('is-active', href === '#' + id);
        });
    }

    /**
     * Ouvre uniquement le panneau correspondant (accordion).
     * Préambule : tout replie pour mettre l’intro en avant.
     */
    function openSectionForId(id) {
        if (id === 'preambule') {
            allDetails.forEach(function (d) {
                d.open = false;
            });
            return;
        }
        var sec = document.getElementById(id);
        if (!sec) return;
        var target = sec.querySelector('details.cgv-details');
        allDetails.forEach(function (d) {
            d.open = target ? d === target : false;
        });
    }

    function navigateToSection(id, opts) {
        opts = opts || {};
        var el = document.getElementById(id);
        if (!el) return;
        openSectionForId(id);
        setActive(id);
        if (opts.updateHash !== false) {
            if (history.replaceState) {
                history.replaceState(null, '', '#' + id);
            } else {
                window.location.hash = id;
            }
        }
        el.scrollIntoView({ behavior: opts.instant ? 'auto' : 'smooth', block: 'start' });
    }

    var ids = [];
    tocLinks.forEach(function (a) {
        var id = a.getAttribute('href').slice(1);
        if (id) ids.push(id);
    });

    var sections = ids
        .map(function (id) {
            return document.getElementById(id);
        })
        .filter(Boolean);

    /** --- Scroll spy --- */
    var visibility = {};
    sections.forEach(function (sec) {
        visibility[sec.id] = 0;
    });

    function pickBestVisible() {
        var bestId = null;
        var best = 0;
        sections.forEach(function (sec) {
            var v = visibility[sec.id] || 0;
            if (v > best) {
                best = v;
                bestId = sec.id;
            }
        });
        if (bestId && best >= 0.05) {
            setActive(bestId);
        }
    }

    if (sections.length) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    visibility[entry.target.id] = entry.isIntersecting
                        ? entry.intersectionRatio
                        : 0;
                });
                pickBestVisible();
            },
            {
                root: null,
                rootMargin: '-12% 0px -45% 0px',
                threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
            }
        );

        sections.forEach(function (sec) {
            observer.observe(sec);
        });
    }

    /** --- Clic sommaire : scroll + ouvrir le <details> --- */
    tocLinks.forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var id = a.getAttribute('href').slice(1);
            if (!id) return;
            navigateToSection(id, { updateHash: true });
        });
    });

    /** --- Chargement / bouton retour avec ancre --- */
    function applyHashFromUrl() {
        var id = window.location.hash.replace(/^#/, '');
        if (!id) return;
        var el = document.getElementById(id);
        if (!el) return;
        navigateToSection(id, { updateHash: false, instant: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            requestAnimationFrame(applyHashFromUrl);
        });
    } else {
        requestAnimationFrame(applyHashFromUrl);
    }

    window.addEventListener('hashchange', function () {
        applyHashFromUrl();
    });
})();
