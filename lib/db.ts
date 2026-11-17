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

export interface ScoreStore {
  sunnan: number;
  alina: number;
  lastUpdated: string;
  history: ScoreHistoryEntry[];
}

export const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://gbuuhpajasqimrchwqvc.supabase.co";
export const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidXVocGFqYXNxaW1yY2h3cXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4MjI5NDUsImV4cCI6MjExMDM5ODk0NX0.oDYbCsmkFMC46NyWCyP5b9pTK0r2LuUkaqDvu0099oY";

// Fallback in-memory state
let inMemoryScore: ScoreStore = {
  sunnan: 5,
  alina: 8,
  lastUpdated: new Date().toISOString(),
  history: [],
};

// Fetch from Supabase Postgres
export async function getScoreFromSupabase(): Promise<ScoreStore> {
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
        const store: ScoreStore = {
          sunnan: Number(row.sunnan),
          alina: Number(row.alina),
          lastUpdated: row.last_updated || new Date().toISOString(),
          history: Array.isArray(row.history) ? row.history : [],
        };
        inMemoryScore = store;
        return store;
      }
    }
  } catch (err) {
    console.warn("Could not query Supabase, fallback to memory:", err);
  }
  return inMemoryScore;
}

// Save to Supabase Postgres
export async function saveScoreToSupabase(updatedData: ScoreStore): Promise<boolean> {
  inMemoryScore = updatedData;
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
