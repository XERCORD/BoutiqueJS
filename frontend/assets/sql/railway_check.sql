-- À lancer dans Railway → Data (une requête à la fois si besoin).
-- Sert à voir POURQUOI SHOW TABLES semble vide.

-- 1) Quelle base est sélectionnée pour cette session ?
SELECT DATABASE() AS base_active;

-- 2) Où sont les tables utilisateur (toutes les bases) ?
SELECT table_schema AS base, COUNT(*) AS nb_tables
FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
GROUP BY table_schema;

-- 3) Tables dans la base « railway » (nom par défaut Railway ; sinon remplace par MYSQLDATABASE dans Variables).
SHOW TABLES FROM railway;
