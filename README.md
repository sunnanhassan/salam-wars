# ⚖️ Salam Wars – The Ultimate Scoreboard
> **1973 Salam Constitution Championship**  
> A fun, friendly competition scoreboard between **Sunnan** and **Alina**.

---

## 🏆 Current Championship Standings

| Competitor | Role / Title | Score | Status |
| :--- | :--- | :---: | :--- |
| 🔵 **Sunnan** | Chief Justice of Salam | **7** | 👑 Currently Leading |
| 🌸 **Alina** | Grand Petitioner of Peace | **4** | ⚔️ Valiant Challenger |

## 📜 1973 Salam Constitution — Official 8 Rules

1. **Rule No. 1 (Presence Mandate):** Dono persons ka office mein present hona lazmi hai. Agar koi WFH ya absent hai, toh us din ka match cancel.
2. **Rule No. 2 (First Strike):** Jo Slack par sabse pehle Assalam-o-Alaikum bhejega, usko +1 point milega. Reply karne par koi point nahi milega.
3. **Rule No. 3 (Geolocation):** Office pohanchne se pehle bheja gaya salam count nahi hoga. Match tabhi start hoga jab dono office mein present hon.
4. **Rule No. 4 (Timestamp Sanctity):** Slack ka original timestamp final proof hoga. Edited messages aur excuses accept nahi honge.
5. **Rule No. 5 (Daily Cap):** Har working day maximum 1 point milega. Multiple messages bhejne se extra points nahi milenge.
6. **Rule No. 6 (Mutual Silence):** Agar dono mein se koi bhi salam nahi karta, toh us din dono ko zero points milenge.
7. **Rule No. 7 (Weekly Winner):** Week ke end par highest score wala winner declare hoga. 🏆
8. **Rule No. 8 (Anti-Excuse):** “Main salam karne hi wala tha” aur “aap pehle kar dete” jaise excuses strictly prohibited hain! 😂

---

## ✨ Features & Design Highlights

- **Dual Interactive Score Controls:**
  - Both Sunnan and Alina can update scores on the fly using the **`+1`** and **`-1`** buttons.
  - Direct score editing: Click the **Pencil icon** on either card to input an exact score anytime.
  - **Local Persistence (`localStorage`):** Real-time score changes automatically persist across browser refreshes so neither side loses their progress!
  - **Reset to Baseline:** A single click on the reset icon restores the original 7–4 constitutional baseline.
- **Audio & Haptic Feedback:**
  - Built-in Web Audio API synthesizers (victory fanfare on scores up, chime on scores down, championship fanfare).
  - Sound effects toggle (mute / unmute) directly in the navigation bar.
- **Micro-Animations & Confetti:**
  - Dynamic confetti particle bursts when increasing points.
  - "Celebrate Championship Moment" button triggers full-screen celebratory bursts.
  - Smooth Framer Motion spring physics on score numbers and cards.
- **Dynamic Leader Detection:**
  - The board dynamically tracks the leader, computes score differentials, and displays the crown on the leader.
  - Handles constitutional deadlocks (ties) gracefully.
- **Constitution Rules Modal:**
  - Reads out the humorous Articles of the 1973 Salam Constitution Championship.
- **Share & Decree Copy:**
  - Generates a shareable summary text ready to paste on WhatsApp or Messenger.

---

## 🚀 Quick Start (Local Development)

```bash
# Navigate to the project directory
cd salam-wars

# Install dependencies (already installed if in current workspace)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment Instructions

This app is configured with `output: "export"` in `next.config.mjs`, making it **100% compatible with static hosting on both Vercel and Netlify**.

### 1. Deploying to Vercel (Recommended)

#### Option A: Via GitHub
1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Framework Preset will auto-detect **Next.js**.
5. Click **Deploy**.

#### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

### 2. Deploying to Netlify

#### Option A: Drag & Drop (Zero Setup)
1. Run the build command locally:
   ```bash
   npm run build
   ```
2. This creates an `out` folder in the project root.
3. Log in to [app.netlify.com/drop](https://app.netlify.com/drop).
4. Drag and drop the `out` folder directly into the Netlify Drop zone! Your website goes live immediately.

#### Option B: Via Git / Netlify CLI
The included `netlify.toml` file already configures:
- Build command: `npm run build`
- Publish directory: `out`
- SPA redirects to `/index.html`

Simply connect your Git repository in Netlify or run:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=out
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Static Export)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Celebration Effects:** [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Audio:** Native Web Audio API (Zero external audio file overhead)

