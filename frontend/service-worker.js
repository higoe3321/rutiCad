self.addEventListener("install", () => {
  console.log("Service Worker instalado");
});

self.addEventListener("fetch", () => {
  // por enquanto não cacheia nada
});
