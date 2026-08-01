/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Route metadata is small and locally available. Resolve it before sending
  // the document so client transitions replace one complete metadata tree
  // instead of leaving a streamed predecessor beside the destination tags.
  htmlLimitedBots: /.*/,
  images: {
    disableStaticImages: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/adhd-treatment-adults-naples-fl",
        destination: "/services/adhd-treatment",
        permanent: true,
      },
      {
        source: "/locations/naples",
        destination: "/locations/psychiatrist-naples",
        permanent: true,
      },
      {
        source: "/locations/psychiatrist-lely-resorts",
        destination: "/locations/psychiatrist-lely-resort",
        permanent: true,
      },
      {
        source: "/es/ubicaciones/psiquiatra-lely-resorts",
        destination: "/es/ubicaciones/psiquiatra-lely-resort",
        permanent: true,
      },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
