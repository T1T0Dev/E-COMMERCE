// src/utils/apiUrl.js
const hostname = window.location.hostname;
const apiUrl =
  hostname === "localhost" || hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : `http://${hostname}:3000`;

export default apiUrl;