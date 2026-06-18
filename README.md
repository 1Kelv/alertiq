# AlertIQ

Interactive fraud analyst training tool built for the **Fraud Analysis Bootcamp**.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

## Deploy to Vercel

Push to GitHub and import the repo at vercel.com — Vercel auto-detects Vite.

## Project structure

```
src/
  data/alerts.js          # All alert scenarios (add new ones here)
  hooks/useTheme.js       # Dark/light mode
  hooks/useTimer.js       # 45-min exam countdown
  components/
    Topbar.jsx
    Landing.jsx
    Simulator.jsx
    Results.jsx
  App.jsx
```

## Training modes

| Mode | Description |
|------|-------------|
| Set 1 · Basic | 8 alerts — account age, IP mismatch, device, spend pattern |
| Set 2 · Intermediate | 7 alerts — velocity, merchant type, email risk |
| Mixed | Randomised blend of Set 1 & 2 |
| ⏱ Set 3 · Exam | 3 full case studies, 45-minute timer |
