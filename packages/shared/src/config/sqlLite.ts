// 환경 감지
const isNode = typeof process !== 'undefined' && process.versions?.node;
const isBrowser = typeof globalThis !== 'undefined' && typeof (globalThis as any).window !== 'undefined';

// 동적으로 모듈을 로드하는 함수들
async function loadSqlite3() {
  // 브라우저 환경에서는 완전히 스킵
  if (isBrowser) {
    return { sqlite3: null, Database: null };
  }
  
  // Next.js SSR 환경에서는 SQLite 로딩을 스킵하고 Mock 모드 사용
  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).window === 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV !== undefined) {
    console.log('Next.js SSR 환경 감지 - Mock 모드로 실행');
    return { sqlite3: null, Database: null };
  }
  
  try {
    // Node.js 순수 환경에서만 better-sqlite3 사용
    const Database = require('better-sqlite3');
    return { sqlite3: null, Database };
  } catch (error) {
    console.warn('better-sqlite3 로드 실패:', error);
    return { sqlite3: null, Database: null };
  }
}

async function loadSqlJs() {
  // Node.js 환경에서는 완전히 스킵
  if (!isBrowser) {
    return null;
  }
  
  try {
    const sqlJsModule = await import('sql.js');
    return sqlJsModule.default;
  } catch (error) {
    console.warn('sql.js 로드 실패:', error);
    return null;
  }
}

// SQLite 데이터베이스 경로 설정
const getDbPath = () => {
  // 브라우저 환경에서는 항상 null 반환
  if (isBrowser) {
    return null;
  }
  
  // 환경변수로 커스텀 경로 설정 가능
  if (typeof process !== 'undefined' && process.env && process.env.SQLITE_DB_PATH) {
    return process.env.SQLITE_DB_PATH;
  }
  
  // Node.js 환경에서 실제 DB 파일 사용
  return './database/keto_app.db';
};

const dbPath = getDbPath();

class SQLiteClient {
  private nodeDb: any | null = null;
  private webDb: any | null = null;
  private isWeb: boolean;
  private isInitialized: boolean = false;

  constructor() {
    this.isWeb = isBrowser;
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      if (this.isWeb) {
        // 브라우저 환경: sql.js 사용
        console.log('브라우저 환경 감지 - sql.js로 SQLite 파일 로드');
        await this.initWebDatabase();
      } else {
        // Node.js 환경 (Next.js SSR 포함): sqlite3 사용
        console.log('Node.js 환경 감지 - sqlite3 사용');
        await this.initNodeDatabase();
      }
    } catch (error) {
      console.error('SQLite 초기화 실패:', error);
      // 실패 시 Mock 데이터 모드로 fallback
      this.isInitialized = true;
    }
  }

  private async initWebDatabase() {
    try {
      // 브라우저에서 sql.js 동적 import
      const initSqlJs = await loadSqlJs();
      if (!initSqlJs) {
        throw new Error('sql.js 로드 실패');
      }
      
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/sql-wasm.wasm`
      });

      // SQLite 파일을 fetch로 로드
      const response = await fetch('/keto_app.db');
      if (!response.ok) {
        throw new Error('SQLite 파일 로드 실패');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      this.webDb = new SQL.Database(uint8Array);
      this.isInitialized = true;
      console.log('✅ 브라우저에서 SQLite 파일 로드 성공');
    } catch (error) {
      console.error('❌ 브라우저 SQLite 초기화 실패:', error);
      // fallback to mock data는 API 레벨에서 처리
    }
  }

  private async initNodeDatabase() {
    return new Promise<void>(async (resolve, reject) => {
      if (!dbPath) {
        reject(new Error('DB 경로가 설정되지 않음'));
        return;
      }

      try {
        const { Database, sqlite3 } = await loadSqlite3();
        if (!Database) {
          reject(new Error('SQLite 모듈이 로드되지 않음'));
          return;
        }
        
        if (sqlite3) {
          // sqlite3 사용 (기존 방식)
          this.nodeDb = new Database(dbPath, (err: Error | null) => {
            if (err) {
              console.error('❌ SQLite 데이터베이스 연결 실패:', err);
              reject(err);
            } else {
              console.log('✅ SQLite 데이터베이스 연결 성공 (sqlite3)');
              this.createTables();
              this.isInitialized = true;
              resolve();
            }
          });
        } else {
          // better-sqlite3 사용 (동기식)
          try {
            this.nodeDb = new Database(dbPath);
            console.log('✅ SQLite 데이터베이스 연결 성공 (better-sqlite3)');
            this.createTablesBetterSqlite3();
            this.isInitialized = true;
            resolve();
          } catch (err) {
            console.error('❌ SQLite 데이터베이스 연결 실패:', err);
            reject(err);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private createTables() {
    if (!this.nodeDb) return;

    // 기존 restaurants 테이블과 호환되는 구조로 확장
    this.nodeDb.run(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        link TEXT,
        phone TEXT,
        address TEXT
      )
    `);

    // 기존 menus 테이블과 호환되는 구조로 확장
    this.nodeDb.run(`
      CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        keto_score INTEGER DEFAULT 0,
        is_main BOOLEAN DEFAULT 1,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
      )
    `);

    // foods 테이블 (추가 기능용)
    this.nodeDb.run(`
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        calories REAL,
        protein REAL,
        fat REAL,
        carbs REAL,
        fiber REAL,
        keto_score REAL,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ SQLite 테이블 구조 확인/생성 완료');
  }

  private createTablesBetterSqlite3() {
    if (!this.nodeDb) return;

    try {
      // better-sqlite3은 동기식으로 작동
      this.nodeDb.exec(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          link TEXT,
          phone TEXT,
          address TEXT
        )
      `);

      this.nodeDb.exec(`
        CREATE TABLE IF NOT EXISTS menus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          keto_score INTEGER DEFAULT 0,
          is_main BOOLEAN DEFAULT 1,
          FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
        )
      `);

      this.nodeDb.exec(`
        CREATE TABLE IF NOT EXISTS foods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          calories REAL,
          protein REAL,
          fat REAL,
          carbs REAL,
          fiber REAL,
          keto_score REAL,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ SQLite 테이블 구조 확인/생성 완료 (better-sqlite3)');
    } catch (error) {
      console.error('❌ 테이블 생성 실패:', error);
    }
  }

  from(table: string) {
    return new SQLiteQueryBuilder(this.nodeDb, this.webDb, table);
  }

  // 직접 SQL 실행 메서드
  async rawSQL(sql: string, params: any[] = []): Promise<{ data: any[] | null; error: any }> {
    try {
      // 데이터베이스 연결이 없으면 빈 결과 반환
      if (!this.webDb && !this.nodeDb) {
        console.log('데이터베이스 연결 없음 - 빈 결과 반환');
        return { data: [], error: null };
      }

      if (this.webDb) {
        // 브라우저 환경: sql.js 사용
        if (params.length > 0) {
          const stmt = this.webDb.prepare(sql);
          const results = [];
          stmt.bind(params);
          while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push(row);
          }
          stmt.free();
          return { data: results, error: null };
        } else {
          const result = this.webDb.exec(sql);
          if (result.length > 0) {
            const columns = result[0].columns;
            const values = result[0].values;
            const results = values.map((row: any) => {
              const obj: any = {};
              columns.forEach((col: any, index: number) => {
                obj[col] = row[index];
              });
              return obj;
            });
            return { data: results, error: null };
          } else {
            return { data: [], error: null };
          }
        }
      } else if (this.nodeDb) {
        // Node.js 환경
        if (this.nodeDb.all) {
          // sqlite3 사용 (비동기)
          return new Promise((resolve) => {
            this.nodeDb!.all(sql, params, (err: Error | null, rows: any[]) => {
              if (err) {
                resolve({ data: null, error: err });
              } else {
                resolve({ data: rows, error: null });
              }
            });
          });
        } else {
          // better-sqlite3 사용 (동기)
          const stmt = this.nodeDb.prepare(sql);
          const rows = stmt.all(...params);
          return { data: rows, error: null };
        }
      } else {
        return { data: [], error: 'Database not connected' };
      }
    } catch (error) {
      return { data: null, error };
    }
  }
  
  // 초기화 완료 대기
  async waitForInit(): Promise<boolean> {
    let attempts = 0;
    const maxAttempts = 50; // 5초 대기
    
    while (!this.isInitialized && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    return this.isInitialized;
  }
}

class SQLiteQueryBuilder {
  private nodeDb: any | null;
  private webDb: any | null;
  private tableName: string;
  private selectFields: string = '*';
  private whereConditions: string[] = [];
  private queryParams: any[] = [];
  private orderByClause: string = '';
  private limitClause: string = '';
  private joinClause: string = '';

  constructor(nodeDb: any | null, webDb: any | null, table: string) {
    this.nodeDb = nodeDb;
    this.webDb = webDb;
    this.tableName = table;
  }

  select(fields: string = '*') {
    this.selectFields = fields;
    return this;
  }

  eq(field: string, value: any) {
    this.whereConditions.push(`${field} = ?`);
    this.queryParams.push(value);
    return this;
  }

  gte(field: string, value: any) {
    this.whereConditions.push(`${field} >= ?`);
    this.queryParams.push(value);
    return this;
  }

  lte(field: string, value: any) {
    this.whereConditions.push(`${field} <= ?`);
    this.queryParams.push(value);
    return this;
  }

  order(field: string, options: { ascending?: boolean } = {}) {
    const direction = options.ascending === false ? 'DESC' : 'ASC';
    this.orderByClause = `ORDER BY ${field} ${direction}`;
    return this;
  }

  limit(count: number) {
    this.limitClause = `LIMIT ${count}`;
    return this;
  }

  join(table: string, condition: string) {
    this.joinClause = `JOIN ${table} ON ${condition}`;
    return this;
  }

  async execute(additionalParams: any[] = []): Promise<{ data: any[] | null; error: any }> {
    const whereClause = this.whereConditions.length > 0 ? 
      `WHERE ${this.whereConditions.join(' AND ')}` : '';
    
    const sql = `SELECT ${this.selectFields} FROM ${this.tableName} ${this.joinClause} ${whereClause} ${this.orderByClause} ${this.limitClause}`.trim();
    const allParams = [...this.queryParams, ...additionalParams];

        if (this.webDb) {
      // 브라우저 환경: sql.js 사용
      try {
        console.log('SQL 쿼리:', sql);
        console.log('파라미터:', allParams);
        
        // sql.js에서는 exec 또는 준비된 문을 사용
        if (allParams.length > 0) {
          const stmt = this.webDb.prepare(sql);
          const results = [];
          stmt.bind(allParams);
          
          while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push(row);
          }
          
          stmt.free();
          console.log('쿼리 결과 개수:', results.length);
          return { data: results, error: null };
        } else {
          // 파라미터가 없는 경우 exec 사용
          const result = this.webDb.exec(sql);
          if (result.length > 0) {
            const columns = result[0].columns;
            const values = result[0].values;
            const results = values.map((row: any) => {
              const obj: any = {};
              columns.forEach((col: any, index: number) => {
                obj[col] = row[index];
              });
              return obj;
            });
            console.log('쿼리 결과 개수:', results.length);
            return { data: results, error: null };
          } else {
            return { data: [], error: null };
          }
        }
} catch (error) {
        console.error('SQL 실행 오류:', error);
        return { data: null, error };
      }
    } else if (this.nodeDb) {
      // Node.js 환경: sqlite3 또는 better-sqlite3 사용
      try {
        if (this.nodeDb.all) {
          // sqlite3 사용 (비동기)
          return new Promise((resolve) => {
            this.nodeDb!.all(sql, allParams, (err: Error | null, rows: any[]) => {
              if (err) {
                resolve({ data: null, error: err });
              } else {
                resolve({ data: rows, error: null });
              }
            });
          });
        } else {
          // better-sqlite3 사용 (동기)
          const stmt = this.nodeDb.prepare(sql);
          const rows = stmt.all(...allParams);
          return { data: rows, error: null };
        }
      } catch (error) {
        return { data: null, error };
      }
    } else {
      return { data: [], error: 'Database not connected' };
    }
  }

  async single(): Promise<{ data: any | null; error: any }> {
    const result = await this.execute();
    if (result.error) {
      return { data: null, error: result.error };
    }
    return { 
      data: result.data && result.data.length > 0 ? result.data[0] : null, 
      error: null 
    };
  }

  // Supabase API 호환성을 위한 메서드들
  overlaps(field: string, values: any[]) {
    // SQLite에서는 JSON 배열 필드의 중복 검사를 위해 LIKE 사용
    const conditions = values.map(() => `${field} LIKE ?`).join(' OR ');
    this.whereConditions.push(`(${conditions})`);
    values.forEach(value => this.queryParams.push(`%${value}%`));
    return this;
  }

  not(field: string, operator: string, values: any[]) {
    if (operator === 'overlap') {
      // 배열 겹침 제외 로직
      const conditions = values.map(() => `${field} NOT LIKE ?`).join(' AND ');
      this.whereConditions.push(`(${conditions})`);
      values.forEach(value => this.queryParams.push(`%${value}%`));
    }
    return this;
  }
}

// SQLite 클라이언트 인스턴스 생성
const sqliteClient = new SQLiteClient();

export { sqliteClient as supabase };
export default sqliteClient;
