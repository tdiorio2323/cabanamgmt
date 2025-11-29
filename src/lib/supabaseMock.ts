/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SupabaseClient } from "@supabase/supabase-js";
import { demoTalent, demoBookings, demoUser } from "./demo-data";

type QueryResult<T> = { data: T[]; count: number; error: null };
type SingleResult<T> = { data: T | null; error: null };
type Subscription = { unsubscribe(): void };
type AuthListener = (event: string, session: { user: any } | null) => void;
type GenericClient = SupabaseClient<any, any, any>;

// Map table names to demo data
const db: Record<string, any[]> = {
  creators: demoTalent,
  bookings: demoBookings,
  users: [demoUser], // minimal user table
  // Add other tables as empty arrays to prevent crashes
  invite_redemptions: [],
  invites: [],
  vip_codes: [],
  vip_passes: [],
  vip_redemptions: [],
  waitlist: [],
  webhook_events: [],
  admin_emails: [],
  app_settings: [],
  audit_log: [],
  notes: [],
  rate_limits: [],
  signup_requests: [],
  stripe_events: [],
};

class MockQueryBuilder<T extends Record<string, unknown> = Record<string, unknown>> {
  private rows: T[];
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    // Clone data to avoid mutation issues, though we want read-only mostly
    this.rows = (db[tableName] || []) as T[];
  }

  select(columns?: string) {
    // Basic column selection logic could be added here, but returning full objects is usually fine for mocks
    if (columns === 'count') {
      // handle count queries if needed, but for now just return rows
    }
    return this;
  }

  insert() {
    // No-op for demo mode
    return Promise.resolve({ data: null, error: null, count: 0 });
  }

  update() {
    // No-op for demo mode
    return Promise.resolve({ data: null, error: null, count: 0 });
  }

  delete() {
    // No-op for demo mode
    return Promise.resolve({ data: null, error: null, count: 0 });
  }

  eq(column: string, value: any) {
    this.rows = this.rows.filter((row) => row[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this.rows = this.rows.filter((row) => row[column] !== value);
    return this;
  }

  gt(column: string, value: any) {
    this.rows = this.rows.filter((row) => {
      const record = row as Record<string, any>;
      return record[column] > value;
    });

    return this;
  }

  lt(column: string, value: any) {
    this.rows = this.rows.filter((row) => {
      const record = row as Record<string, any>;
      return record[column] < value;
    });
    return this;
  }

  gte(column: string, value: any) {
    this.rows = this.rows.filter((row) => {
      const record = row as Record<string, any>;
      return record[column] >= value;
    });
    return this;
  }

  lte(column: string, value: any) {
    this.rows = this.rows.filter((row) => {
      const record = row as Record<string, any>;
      return record[column] <= value;
    });
    return this;
  }

  in(column: string, values: any[]) {
    this.rows = this.rows.filter((row) => {
      const record = row as Record<string, any>;
      return values.includes(record[column]);
    });
    return this;
  }

  is(column: string, value: any) {
    this.rows = this.rows.filter((row) => {
      const record = row as Record<string, any>;
      return record[column] === value;
    });
    return this;
  }

  match(query: Record<string, any>) {
    this.rows = this.rows.filter((row) => {
      const record = row as Record<string, any>;
      return Object.entries(query).every(([key, value]) => record[key] === value);
    });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.rows.sort((a, b) => {
      const recordA = a as Record<string, any>;
      const recordB = b as Record<string, any>;
      if (recordA[column] < recordB[column]) return ascending ? -1 : 1;
      if (recordA[column] > recordB[column]) return ascending ? 1 : -1;
      return 0;
    });
    return this;
  }

  limit(count: number) {
    this.rows = this.rows.slice(0, count);
    return Promise.resolve({ data: this.rows, error: null, count: this.rows.length });
  }

  range(from: number, to: number) {
    this.rows = this.rows.slice(from, to + 1);
    return Promise.resolve({ data: this.rows, error: null, count: this.rows.length });
  }

  single(): Promise<SingleResult<T>> {
    return Promise.resolve({ data: this.rows[0] ?? null, error: null });
  }

  maybeSingle(): Promise<SingleResult<T>> {
    return Promise.resolve({ data: this.rows[0] ?? null, error: null });
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onFulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    const result = {
      data: this.rows,
      count: this.rows.length,
      error: null,
    };
    return Promise.resolve(result).then(onFulfilled, onRejected);
  }
}

const mockSession = {
  user: demoUser,
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
};

const mockAuth = {
  async signOut() {
    return { error: null };
  },
  async signInWithPassword() {
    return { data: { session: mockSession, user: demoUser }, error: null };
  },
  async signInWithOtp() {
    return { data: { session: null, user: null }, error: null };
  },
  async verifyOtp() {
    return { data: { session: mockSession, user: demoUser }, error: null };
  },
  async getSession() {
    return { data: { session: mockSession }, error: null };
  },
  async getUser() {
    return { data: { user: demoUser }, error: null };
  },
  onAuthStateChange(callback: AuthListener) {
    // Immediately trigger signed in state for demo
    callback("SIGNED_IN", { user: demoUser } as any);
    return {
      data: { subscription: { unsubscribe() {} } as Subscription },
      error: null,
    };
  },
  admin: {
    listUsers: async () => {
      return { data: { users: [demoUser] }, error: null };
    },
    createUser: async () => {
      return { data: { user: demoUser }, error: null };
    },
    deleteUser: async () => {
      return { data: null, error: null };
    },
  },
};

const createMockClient = () => ({
  auth: mockAuth,
  from(tableName: string) {
    return new MockQueryBuilder(tableName);
  },
  storage: {
    from() {
      return {
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://placeholder.co/${path}` } }),
        upload: () => Promise.resolve({ data: { path: "mock/path" }, error: null }),
        download: () => Promise.resolve({ data: new Blob(), error: null }),
      }
    }
  },
  functions: {
    invoke: () => Promise.resolve({ data: null, error: null })
  }
});

export const supabaseMock = {
  session: mockSession,
  browser: createMockClient() as unknown as GenericClient,
  server: createMockClient() as unknown as GenericClient,
  admin: createMockClient() as unknown as GenericClient,
};
