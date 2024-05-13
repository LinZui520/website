/** @types {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.zhuguishihundan.cn',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;
