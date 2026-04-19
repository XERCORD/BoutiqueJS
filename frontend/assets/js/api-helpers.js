/**
 * Appels API — évite les plantages quand le serveur renvoie { error: "..." } (ex. Railway / MySQL).
 */
window.fetchJsonArray = function fetchJsonArray(url, init) {
    return fetch(url, init || {}).then(function (response) {
        return response.text().then(function (text) {
            var data;
            try {
                data = text ? JSON.parse(text) : null;
            } catch (e) {
                if (!response.ok) {
                    throw new Error(
                        'Réponse non JSON (souvent HTML 404). Vérifie que le serveur Node et /api sont déployés.'
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
