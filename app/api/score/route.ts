import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface ScoreHistoryEntry {
  id: string;
  timestamp: string;
  formattedTime: string;
  target: string;
  action: string;
  sunnan: number;
  alina: number;
  prevSunnan?: number;
  prevAlina?: number;
  device?: string;
  ip?: string;
}

interface ScoreStore {
  sunnan: number;
  alina: number;
  lastUpdated: string;
  history: ScoreHistoryEntry[];
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://gbuuhpajasqimrchwqvc.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidXVocGFqYXNxaW1yY2h3cXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4MjI5NDUsImV4cCI6MjExMDM5ODk0NX0.oDYbCsmkFMC46NyWCyP5b9pTK0r2LuUkaqDvu0099oY";

// Fallback in-memory baseline
let inMemoryScore: ScoreStore = {
  sunnan: 5,
  alina: 7,
  lastUpdated: new Date().toISOString(),
  history: [],
};

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

// Fetch from Supabase Postgres
async function getScoreFromSupabase(): Promise<ScoreStore | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/salam_wars_state?id=eq.current&select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const row = data[0];
        return {
          sunnan: Number(row.sunnan),
          alina: Number(row.alina),
          lastUpdated: row.last_updated || new Date().toISOString(),
          history: Array.isArray(row.history) ? row.history : [],
        };
      }
    }
  } catch (err) {
    console.warn("Could not query Supabase, fallback to memory:", err);
  }
  return null;
}

// Save to Supabase Postgres
async function saveScoreToSupabase(updatedData: ScoreStore): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/salam_wars_state?id=eq.current`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          sunnan: updatedData.sunnan,
          alina: updatedData.alina,
          last_updated: updatedData.lastUpdated,
          history: updatedData.history,
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.warn("Could not save to Supabase, fallback to memory:", err);
    return false;
  }
}

export async function GET() {
  const dbData = await getScoreFromSupabase();
  if (dbData) {
    inMemoryScore = dbData;
    return NextResponse.json(dbData);
  }
  return NextResponse.json(inMemoryScore);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sunnan = Math.max(0, parseInt(body.sunnan, 10) || 0);
    const alina = Math.max(0, parseInt(body.alina, 10) || 0);
    const target =
      body.target ||
      (sunnan !== inMemoryScore.sunnan
        ? "Sunnan"
        : alina !== inMemoryScore.alina
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

    const prevSunnan = inMemoryScore.sunnan;
    const prevAlina = inMemoryScore.alina;

    // Detailed log for Vercel Observability Runtime Logs
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

    // First fetch latest from DB to prevent race conditions
    const currentDb = await getScoreFromSupabase();
    const currentHistory = currentDb?.history || inMemoryScore.history || [];
    const updatedHistory = [newHistoryEntry, ...currentHistory].slice(0, 100);

    const updatedData: ScoreStore = {
      sunnan,
      alina,
      lastUpdated: now.toISOString(),
      history: updatedHistory,
    };

    inMemoryScore = updatedData;

    // Persist permanently to Supabase PostgreSQL database
    await saveScoreToSupabase(updatedData);

    return NextResponse.json(updatedData);
  } catch (err) {
    console.error("POST /api/score error:", err);
    return NextResponse.json({ error: "Invalid score payload" }, { status: 400 });
  }
}
