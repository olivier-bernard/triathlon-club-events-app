import { NextConfig } from 'next';
// import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Uncomment to use WebPack instead of TurboPack for Vercel deployment. This is required to deploy PWA applications.
  // experimental: {
  // turbo: {
  //   enabled: false,
  // },
};

// export nextConfig for Turbopack. Will see to configure Turbopack or use webpack to deploy to Vercel
export default nextConfig;

// export default withPWA({
//   ...nextConfig,
//   pwa: {
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//     disable: process.env.NODE_ENV === 'development',
//   },
// });