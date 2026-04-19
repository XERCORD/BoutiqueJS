/**
 * Base URL de l’API : même origine que la page, ou méta api-origin, ou port dev (Live Server → :3000).
 */
window.resolveApiUrl = function resolveApiUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (/^https?:\/\//i.test(url)) return url;

    var meta =
        typeof document !== 'undefined' ? document.querySelector('meta[name="api-origin"]') : null;
    var metaContent = meta && meta.getAttribute('content');
    if (metaContent && String(metaContent).trim() !== '') {
        return String(metaContent).replace(/\/$/, '') + url;
    }

    if (typeof window === 'undefined' || !window.location) return url;

    var loc = window.location;
    if (loc.protocol === 'file:') {
        return 'http://127.0.0.1:3000' + url;
    }

    var host = loc.hostname;
    var port = loc.port;
    var livePorts = { '5500': 1, '5501': 1, '5173': 1, '4173': 1 };
    if ((host === 'localhost' || host === '127.0.0.1') && livePorts[port]) {
        return 'http://127.0.0.1:3000' + url;
    }

    return url;
};

/**
 * Appels API — évite les plantages quand le serveur renvoie { error: "..." } (ex. Railway / MySQL).
 */
window.fetchJsonArray = function fetchJsonArray(url, init) {
    return fetch(resolveApiUrl(url), init || {}).then(function (response) {
        return response.text().then(function (text) {
            var data;
            try {
                data = text ? JSON.parse(text) : null;
            } catch (e) {
                if (!response.ok) {
                    throw new Error(
                        'Réponse non JSON (souvent HTML 404). Lance le serveur Node (port 3000) et ouvre le site depuis cette adresse, ou configure meta api-origin.'
                    );
                }
                throw new Error('Réponse invalide');
            }
            if (!response.ok) {
                var msg =
                    (data && (data.error || data.message)) ||
                    'Erreur serveur (' + response.status + ')';
                throw new Error(msg);
            }
            if (!Array.isArray(data)) {
                var msg2 =
                    (data && (data.error || data.message)) ||
                    'Réponse invalide (liste de produits attendue)';
                throw new Error(msg2);
            }
            return data;
        });
    });
};

/**
 * Init page au chargement (navigation classique, sans SPA).
 * Le paramètre filename est ignoré : chaque page ne charge que son propre script.
 */
window.bindPage = function (_filename, initFn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFn);
    } else {
        initFn();
    }
};
