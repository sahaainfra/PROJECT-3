// Part 00 — API error envelope (SA-11, SA-17). Every endpoint returns
// { ok, data?, error?: { code, message, correlationId } } with a correlation ID.
import crypto from "node:crypto";
import { NextResponse } from "next/server";

export function correlationId(): string {
  return crypto.randomUUID();
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(status: number, code: string, message: string) {
  return NextResponse.json(
    { ok: false, error: { code, message, correlationId: correlationId() } },
    { status }
  );
}
