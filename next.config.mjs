/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Tells Next.js to build static HTML/CSS/JS assets
  images: {
    unoptimized: true, // Required for static exports
  },
};

export default nextConfig;