/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ketobab/shared'],
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    HUGGING_FACE_TOKEN: process.env.HUGGING_FACE_TOKEN,
  },
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
