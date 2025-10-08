// Dépendances requises pour le proxy
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// --- 1. CONFIGURATION DE LA CIBLE (VOTRE BACKEND SUR CPANEL) ---
// L'URL de votre backend principal. Cette URL est la CIBLE du proxy.
const API_TARGET_URL = 'https://cemactradeapi.e-jabbing.net';

// Le port est fourni par Render/Railway (process.env.PORT)
const PORT = process.env.PORT || 3000;

// --- 2. CONFIGURATION CORS (Pour autoriser le Frontend) ---

// L'URL exacte de votre frontend pour les requêtes (ORIGINE)
const frontendURL = 'https://cemac-trade.e-jabbing.net'; 

const corsOptions = {
    origin: frontendURL, // Seule cette origine (votre frontend) est autorisée
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
    credentials: true,
    optionsSuccessStatus: 204
};

// Appliquer le middleware CORS avant le proxy
app.use(cors(corsOptions));

// Optionnel : un logger de base pour voir les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- 3. CONFIGURATION DU PROXY ---

// Crée le middleware de proxy. Toutes les requêtes seront redirigées vers API_TARGET_URL.
const apiProxy = createProxyMiddleware({
    target: API_TARGET_URL,
    changeOrigin: true, // Nécessaire pour les hôtes virtuels
    // Optionnel : Gérer les en-têtes d'autorisation ou de host si nécessaire
    onProxyReq: (proxyReq, req, res) => {
        // Optionnel : vous pouvez modifier ici la requête avant qu'elle ne parte vers cPanel
        // console.log(`Proxying request: ${req.method} ${req.originalUrl} to ${API_TARGET_URL}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Optionnel : vous pouvez modifier ici la réponse venant de cPanel
        // console.log(`Response received from target for: ${req.originalUrl}`);
    },
    // Le chemin d'accès ('/') signifie que toutes les requêtes sont proxyfiées
});

// Appliquer le proxy à toutes les routes.
// Toute requête envoyée au proxy sera transmise à https://cemactradeapi.e-jabbing.net/
app.use('/', apiProxy);


// --- 4. DÉMARRAGE DU SERVEUR ---

app.listen(PORT, () => {
    console.log(`✅ API Proxy démarré sur le port ${PORT}`);
    console.log(`➡️  Redirection vers la cible : ${API_TARGET_URL}`);
});

// Pas besoin d'exporter ici puisque Render/Railway lance directement via 'npm start'
