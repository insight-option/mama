/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Arabic is the default language.
      { source: "/", destination: "/ar", permanent: false },
    ];
  },
};

module.exports = nextConfig;
