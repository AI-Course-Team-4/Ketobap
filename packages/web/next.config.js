/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ketobab/shared'],
  
  // React Strict Mode 비활성화 (개발 모드에서 이중 실행 방지)
  reactStrictMode: false,
  
  // env 설정 제거: 현재 SQLite 사용 중이므로 Supabase 환경변수 불필요
  webpack: (config, { isServer }) => {
    // 클라이언트 사이드에서 Node.js 전용 모듈들을 제외
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        assert: false,
        url: false,
        querystring: false,
      };
      
      // Node.js 전용 모듈들을 외부 종속성으로 표시
      config.externals = config.externals || [];
      config.externals.push({
        'sqlite3': 'commonjs sqlite3',
        'better-sqlite3': 'commonjs better-sqlite3',
        'bindings': 'commonjs bindings',
        'node-pre-gyp': 'commonjs node-pre-gyp',
      });
    }
    
    return config;
  },
}

module.exports = nextConfig