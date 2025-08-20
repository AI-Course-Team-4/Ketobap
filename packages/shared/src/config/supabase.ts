import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

// 로컬 개발 환경에서는 Supabase 연결 오류를 무시
let supabase: any;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.warn('Supabase 연결 실패, 로컬 개발 모드로 실행됩니다:', error);
  // 더미 Supabase 클라이언트 생성
  supabase = {
    from: (table: string) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
      gte: () => ({ data: [], error: null }),
      lte: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null })
    })
  };
}

export { supabase };
export default supabase;
