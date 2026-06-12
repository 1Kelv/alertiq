# Fraud Alert Simulator

Interactive fraud analyst training tool built for the **Fraud Analysis Bootcamp**.

## How to use

Open `index.html` in any browser — no install, no internet required.

## Modes

| Mode | Description |
|------|-------------|
| **Set 1 · Basic** | 8 alerts covering account age, IP mismatch, device, spend pattern |
| **Set 2 · Intermediate** | 7 alerts adding velocity, merchant type, email risk scoring |
| **Mixed** | Randomised blend of Set 1 & 2 |
| **⏱ Set 3 · Exam** | 3 full case studies with 45-minute countdown timer |

## Features

- Randomised alert order every session — students can't memorise answers
- Reasoning box required before submitting any decision
- Instant feedback with explanation + red flag / green signal chips
- Partial credit (5 pts) for Escalate when correct answer is Block (and vice versa)
- 45-minute countdown timer for exam mode with time-up overlay
- End-of-session results screen with grade, stats, and per-alert breakdown
- Print / Save score report (File → Print or Ctrl+P)

## Decisions

- **Approve** — transaction is genuine, allow through
- **Escalate** — too risky to approve alone, refer to senior analyst
- **Block** — strong fraud signals, stop the transaction

## Scoring

| Decision | Points |
|----------|--------|
| Correct | 10 |
| Escalate ↔ Block (right direction, wrong severity) | 5 |
| Incorrect | 0 |
