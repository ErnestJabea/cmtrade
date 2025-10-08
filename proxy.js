const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Le domaine de votre backend principal sur cPanel (CIBLE)
const API_TARGET_URL = 'https://cemactradeapi.e-jabbing.net';

// Le domaine de votre frontend (pour CORS)
const FRONTEND_ORIGIN = 'https://cemac-trade.e-jabbing.net'; 

// Configuration CORS
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware de Proxy
// Toutes les requêtes envoyées à ce serveur (proxy) seront redirigées vers la CIBLE
const apiProxy = createProxyMiddleware({
  target: API_TARGET_URL,
  changeOrigin: true, // Nécessaire pour les hôtes virtuels
  // Optionnel: ajouter un logger pour le debug
  // logLevel: 'debug' 
});

// Appliquer le proxy à toutes les requêtes (le path '/' couvre tout)
app.use('/', apiProxy); 

app.listen(PORT, () => {
  console.log(`Proxy Server running on port ${PORT}`);
  console.log(`Forwarding requests to: ${API_TARGET_URL}`);
});