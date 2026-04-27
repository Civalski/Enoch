import { afterEach, describe, expect, it } from "vitest";
import { enhanceSupabasePostgresUrl, stripWorkerUnsupportedTlsFileParams } from "./database-url";

const ORIGINAL_ENV = {
  DATABASE_SSL_INSECURE: process.env.DATABASE_SSL_INSECURE,
  DATABASE_SSL_STRICT: process.env.DATABASE_SSL_STRICT,
  NODE_ENV: process.env.NODE_ENV,
};

afterEach(() => {
  for (const [k, v] of Object.entries(ORIGINAL_ENV)) {
    if (v === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }
});

describe("enhanceSupabasePostgresUrl", () => {
  it("adds TLS require with libpq compatibility when sslmode is absent", () => {
    process.env.NODE_ENV = "production";
    delete process.env.DATABASE_SSL_INSECURE;
    const url =
      "postgres://user:pass@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
    expect(enhanceSupabasePostgresUrl(url)).toBe(
      `${url}&sslmode=require&uselibpqcompat=true`,
    );
  });

  it("keeps explicit verify-full intact", () => {
    process.env.NODE_ENV = "production";
    const url =
      "postgres://user:pass@db.project.supabase.co:5432/postgres?sslmode=verify-full";
    expect(enhanceSupabasePostgresUrl(url)).toBe(url);
  });

  it("adds libpq compatibility to explicit require in production", () => {
    process.env.NODE_ENV = "production";
    const url =
      "postgres://user:pass@db.project.supabase.co:5432/postgres?sslmode=require";
    expect(enhanceSupabasePostgresUrl(url)).toBe(`${url}&uselibpqcompat=true`);
  });

  it("downgrades verify-full to require when insecure TLS is enabled", () => {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_SSL_INSECURE = "true";
    const url =
      "postgres://user:pass@db.project.supabase.co:5432/postgres?sslmode=verify-full";
    expect(enhanceSupabasePostgresUrl(url)).toBe(
      "postgres://user:pass@db.project.supabase.co:5432/postgres?sslmode=require&uselibpqcompat=true",
    );
  });

  it("adds libpq compatibility when insecure TLS adds require", () => {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_SSL_INSECURE = "true";
    const url =
      "postgres://user:pass@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
    expect(enhanceSupabasePostgresUrl(url)).toBe(
      `${url}&sslmode=require&uselibpqcompat=true`,
    );
  });
});

describe("stripWorkerUnsupportedTlsFileParams", () => {
  it("removes file-based TLS params that cannot work in Workers", () => {
    const url =
      "postgres://user:pass@db.project.supabase.co:5432/postgres?sslrootcert=system&sslkey=/tmp/key.pem&sslcert=/tmp/cert.pem&sslmode=require";
    expect(stripWorkerUnsupportedTlsFileParams(url)).toBe(
      "postgres://user:pass@db.project.supabase.co:5432/postgres?sslmode=require",
    );
  });
});
