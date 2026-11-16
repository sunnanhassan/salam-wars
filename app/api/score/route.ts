import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

// In-memory fallback
let inMemoryScore: ScoreStore = {
  sunnan: 20,
  alina: 20,
  lastUpdated: new Date().toISOString(),
  history: [],
};

function getScoreFilePath() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "scores.json");
  }
  return path.join(process.cwd(), "data", "scores.json");
}

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
  const filePath = getScoreFilePath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.sunnan === "number" && typeof parsed.alina === "number") {
        inMemoryScore = {
          sunnan: parsed.sunnan,
          alina: parsed.alina,
          lastUpdated: parsed.lastUpdated || inMemoryScore.lastUpdated,
          history: Array.isArray(parsed.history) ? parsed.history : inMemoryScore.history,
        };
        return NextResponse.json(inMemoryScore);
      }
    }
  } catch (err) {
    console.error("Error reading score file:", err);
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

    const existingHistory = Array.isArray(inMemoryScore.history)
      ? inMemoryScore.history
      : [];
    const updatedHistory = [newHistoryEntry, ...existingHistory].slice(0, 100);

    const updatedData: ScoreStore = {
      sunnan,
      alina,
      lastUpdated: now.toISOString(),
      history: updatedHistory,
    };

    inMemoryScore = updatedData;

    const filePath = getScoreFilePath();
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Could not persist to file, fallback to memory:", fsErr);
    }

    return NextResponse.json(updatedData);
  } catch (err) {
    console.error("POST /api/score error:", err);
    return NextResponse.json({ error: "Invalid score payload" }, { status: 400 });
  }
}
