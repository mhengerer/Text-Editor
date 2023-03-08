const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

// Precache and route assets and pages
precacheAndRoute(self.__WB_MANIFEST);

// Create a strategy to cache assets
const assetCache = new CacheFirst({
  cacheName: "asset-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    }),
  ],
});

// Warm up the asset cache with specific URLs
warmStrategyCache({
  urls: ["/css/main.css", "/js/app.js"],
  strategy: assetCache,
});

// Register a route for asset requests
registerRoute(
  ({ request }) => request.destination === "script" || request.destination === "style" || request.destination === "image",
  new CacheFirst({
    cacheName: "asset-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);
