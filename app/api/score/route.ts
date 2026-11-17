import { NextResponse } from "next/server";
import {
  getScoreFromSupabase,
  saveScoreToSupabase,
  ScoreHistoryEntry,
  ScoreStore,
} from "@/lib/db";

export const dynamic = "force-dynamic";

function parseDevice(userAgent: string): string {
  if (/iphone/i.test(userAgent)) return "iPhone";
  if (/android/i.test(userAgent)) return "Android";
  if (/ipad/i.test(userAgent)) return "iPad";
  if (/windows/i.test(userAgent)) return "Windows PC";
  if (/macintosh|mac os x/i.test(userAgent)) return "Mac";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Web Browser";
}

function formatPkt(date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-PK", {
      timeZone: "Asia/Karachi",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export async function GET() {
  const data = await getScoreFromSupabase();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentDb = await getScoreFromSupabase();

    const sunnan = Math.max(0, parseInt(body.sunnan, 10) || 0);
    const alina = Math.max(0, parseInt(body.alina, 10) || 0);
    const target =
      body.target ||
      (sunnan !== currentDb.sunnan
        ? "Sunnan"
        : alina !== currentDb.alina
        ? "Alina"
        : "Score");
    const action = body.action || "edit";

    const userAgent = request.headers.get("user-agent") || "Unknown Device";
    const ipHeader =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "Unknown IP";
    const ip = ipHeader.split(",")[0].trim();
    const device = parseDevice(userAgent);

    const now = new Date();
    const formattedTime = `${formatPkt(now)} PKT`;

    const prevSunnan = currentDb.sunnan;
    const prevAlina = currentDb.alina;

    console.log(
      `🔔 [SALAM WARS CHANGE] [${formattedTime}] Target: ${target} (${action}) | Sunnan: ${prevSunnan} -> ${sunnan} | Alina: ${prevAlina} -> ${alina} | Device: ${device} | IP: ${ip}`
    );

    const newHistoryEntry: ScoreHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      formattedTime,
      target,
      action,
      sunnan,
      alina,
      prevSunnan,
      prevAlina,
      device,
      ip: ip.replace(/:.*/, ""),
    };

    const currentHistory = Array.isArray(currentDb.history)
      ? currentDb.history
      : [];
    const updatedHistory = [newHistoryEntry, ...currentHistory].slice(0, 100);

    const updatedData: ScoreStore = {
      sunnan,
      alina,
      lastUpdated: now.toISOString(),
      history: updatedHistory,
    };

    await saveScoreToSupabase(updatedData);

    return NextResponse.json(updatedData);
  } catch (err) {
    console.error("POST /api/score error:", err);
    return NextResponse.json({ error: "Invalid score payload" }, { status: 400 });
  }
}
