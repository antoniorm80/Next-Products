/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname:'firebasestorage.googleapis.com',
                pathname:'**'
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
              },
              {
                protocol: "https",
                hostname: "images.unsplash.com",
              },
        ]
    }
};

export default nextConfig;
