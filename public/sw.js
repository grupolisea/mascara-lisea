self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activo");
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", () => {});