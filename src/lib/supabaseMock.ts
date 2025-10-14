/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SupabaseClient } from "@supabase/supabase-js";

type QueryResult<T> = { data: T[]; count: number; error: null };

type SingleResult<T> = { data: T | null; error: null };

type Subscription = { unsubscribe(): void };

type AuthListener = (event: string, session: { user: { id: string; email: string } } | null) => void;

type GenericClient = SupabaseClient<any, any, any>;

class MockQueryBuilder<T extends Record<string, unknown> = Record<string, unknown>> {
  private readonly rows: T[];

  private readonly result: QueryResult<T>;

  constructor(data: T[] = []) {
    this.rows = data;
    this.result = {
      data: this.rows,
      count: this.rows.length,
      error: null,
    };
  }

  select() {
    return this;
  }

  insert() {
    return Promise.resolve(this.result);
  }

  update() {
    return Promise.resolve(this.result);
  }

  delete() {
    return Promise.resolve(this.result);
  }

  eq() {
    return this;
  }

  match() {
    return this;
  }

  order() {
    return this;
  }

  limit() {
    return Promise.resolve({ data: this.rows, error: null as null });
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
    return Promise.resolve(this.result).then(onFulfilled, onRejected);
  }
}

const mockSession = {
  user: {
    id: "mock-user",
    email: "mock@cabana.local",
  },
};

const mockAuth = {
  async signOut() {
    return { error: null as null };
  },
  async signInWithPassword() {
    return { data: { session: mockSession }, error: null as null };
  },
  async getSession() {
    return { data: { session: mockSession }, error: null as null };
  },
  onAuthStateChange(callback: AuthListener) {
    callback("SIGNED_IN", mockSession);
    return {
      data: { subscription: { unsubscribe() {} } as Subscription },
      error: null as null,
    };
  },
};

const browserClient = {
  auth: mockAuth,
  from() {
    return new MockQueryBuilder();
  },
};

const serverClient = {
  auth: {
    async getSession() {
      return { data: { session: mockSession }, error: null as null };
    },
    async signOut() {
      return { error: null as null };
    },
  },
  from() {
    return new MockQueryBuilder();
  },
};

const adminClient = {
  auth: {
    admin: {
      async listUsers() {
        return {
          data: { users: [{ id: mockSession.user.id, email: mockSession.user.email }] },
          error: null as null,
        };
      },
    },
  },
  from() {
    return new MockQueryBuilder();
  },
};

export const supabaseMock = {
  session: mockSession,
  browser: browserClient as unknown as GenericClient,
  server: serverClient as unknown as GenericClient,
  admin: adminClient as unknown as GenericClient,
};
