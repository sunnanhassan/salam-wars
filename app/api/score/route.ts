import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// In-memory fallback
let inMemoryScore = {
  sunnan: 4,
  alina: 7,
  lastUpdated: new Date().toISOString(),
};

function getScoreFilePath() {
  // If running in Vercel serverless environment, write to writable /tmp
  if (process.env.VERCEL) {
    return path.join("/tmp", "scores.json");
  }
  return path.join(process.cwd(), "data", "scores.json");
}

export async function GET() {
  const filePath = getScoreFilePath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.sunnan === "number" && typeof parsed.alina === "number") {
        inMemoryScore = parsed;
        return NextResponse.json(parsed);
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

    const updatedData = {
      sunnan,
      alina,
      lastUpdated: new Date().toISOString(),
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
    return NextResponse.json({ error: "Invalid score payload" }, { status: 400 });
  }
}

