let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';

// type estudiantes or pas
function buildApiBaseUrl (type, tramite) {
 return  process.env.NODE_ENV === "development" ? urljoin(service, type, "/gestion-tramites", tramite) : window.location.href
}

exports.buildApiBaseUrl = buildApiBaseUrl;