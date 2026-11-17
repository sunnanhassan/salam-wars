import { Scoreboard } from "@/components/Scoreboard";
import { getScoreFromSupabase } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const initialData = await getScoreFromSupabase();

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#080d1a] to-[#04070e] flex items-center justify-center">
      <Scoreboard initialData={initialData} />
    </main>
  );
}
