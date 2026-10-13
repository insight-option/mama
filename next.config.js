const fs = require("fs");
const path = require("path");

// Hero video files are optional. Detect them at build time so the page only
// references videos that exist (drop hero.mp4 / hero.webm into
// public/videos/ and redeploy).
const heroVideos = ["hero.webm", "hero.mp4"].filter((file) =>
  fs.existsSync(path.join(__dirname, "public", "videos", file)),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HERO_VIDEOS: heroVideos.join(","),
  },
  webpack(config, { dev }) {
    // The local mock (npm run dev:mock) never ships: production builds get
    // a stub in place of its browser and file-store modules.
    if (!dev) {
      const stub = path.join(__dirname, "lib", "local-mock", "disabled.ts");
      for (const name of ["client", "store"]) {
        config.resolve.alias[path.join(__dirname, "lib", "local-mock", name)] = stub;
      }
    }
    return config;
  },
  async redirects() {
    return [
      // Arabic is the default language.
      { source: "/", destination: "/ar", permanent: false },
    ];
  },
};

module.exports = nextConfig;
