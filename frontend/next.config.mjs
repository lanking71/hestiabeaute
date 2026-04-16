/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Docker 경량 빌드용
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/**",
      },
      {
        // Docker 환경에서 nginx를 통한 이미지 접근
        protocol: "http",
        hostname: "**",
        pathname: "/static/**",
      },
    ],
    unoptimized: true, // nginx가 정적 파일을 직접 서빙하므로
  },
};

export default nextConfig;
