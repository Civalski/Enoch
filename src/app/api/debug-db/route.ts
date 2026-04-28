import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const p = getPrisma();
    const start = Date.now();
    const count = await p.tenant.count();
    const time = Date.now() - start;
    return NextResponse.json({ success: true, count, time });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      name: error.name
    }, { status: 500 });
  }
}