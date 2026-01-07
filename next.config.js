const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['shared'],
  // useSearchParams() 사용 페이지들의 정적 생성 방지
  output: 'standalone',
  // useSearchParams() prerendering 에러 방지 (렌더 배포용)
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config, { isServer }) => {
    // frontend/shared 폴더를 경로 별칭으로 추가
    const sharedPath = path.resolve(__dirname, './shared')
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/shared': sharedPath,
      '@/shared/types': path.resolve(sharedPath, 'types'),
    }
    
    return config
  },
}

module.exports = nextConfig
