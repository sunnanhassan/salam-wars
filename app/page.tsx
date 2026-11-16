import { Scoreboard } from "@/components/Scoreboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#080d1a] to-[#04070e] flex items-center justify-center">
      <Scoreboard />
    </main>
  );
}

