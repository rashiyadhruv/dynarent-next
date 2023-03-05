/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", `i.ibb.co`, `res.cloudinary.com`],
  },
};

module.exports = nextConfig;
