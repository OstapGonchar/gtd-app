# Weekly Five - Ship 5 Things. Every Week.

> A minimalist productivity app for leaders who spend their days helping others but struggle to make progress on their own goals.

## The Philosophy

**Less is more.** Most task managers let you add unlimited tasks, which leads to overwhelm and procrastination. Weekly Five forces focus by limiting you to **exactly 5 tasks per week**. No more hiding behind a 50-item backlog. Pick your battles. Ship what matters.

## Problem Statement

As a Head of Technology (or any busy leader), you spend most of your time unblocking others, attending meetings, and fighting fires. Your personal goals—the strategic projects, the skill development, the things that move your career forward—keep getting pushed to "next week."

Weekly Five makes you confront this every week: **What are the 5 most important things YOU will ship?**

## Core Features

### Implemented (MVP)

- [x] **Weekly task planning** - Add up to 5 tasks per week
- [x] **Priority levels** - High (red), Medium (amber), Low (green)
- [x] **Task completion** - Mark tasks as done with satisfying checkmarks
- [x] **Week navigation** - Browse current and past weeks
- [x] **History tab** - See your entire journey at a glance
- [x] **Progress tracking** - Visual progress bar with completion stats
- [x] **Streak counter** - Track consecutive perfect weeks
- [x] **All-time stats** - Tasks shipped, perfect weeks, ship rate
- [x] **Engagement features** - Emojis based on completion rate
- [x] **Demo data seeding** - Simulated history for testing
- [x] **Local storage** - Data persists on device via AsyncStorage
- [x] **Cross-platform** - iOS, Android, and Web via Expo

### Engagement Mechanics

The app uses subtle gamification to keep you motivated:

- **Completion emojis**: 100% gets fire, 80%+ gets muscle, 60%+ thumbs up
- **Streak badge**: Shows consecutive perfect weeks in the header
- **"Shipped" language**: You don't "complete" tasks, you *ship* them
- **Slot counter**: "3 slots remaining" creates positive constraint
- **Summary stats**: All-time metrics reward consistency

### Planned Features (Post-MVP)

- [ ] Rollover incomplete tasks to next week (with guilt indicator)
- [ ] Weekly reflection prompts ("What blocked you?")
- [ ] Eisenhower matrix view (urgent/important quadrants)
- [ ] Export data (JSON/CSV for backup)
- [ ] Recurring tasks ("Weekly 1:1 prep" every week)
- [ ] Notes/details per task
- [ ] Dark/light theme toggle
- [ ] Push notification reminders

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.81 |
| Platform | Expo ~54 |
| Language | TypeScript ~5.9 |
| Storage | AsyncStorage (local JSON) |
| UI | React Native StyleSheet |
| Targets | iOS, Android, Web |

## Architecture

```
gtd-app/
├── App.tsx                 # Main component with UI and state
├── src/
│   ├── database.ts         # Storage layer (AsyncStorage abstraction)
│   ├── types.ts            # TypeScript interfaces
│   └── assets/             # Icons and splash screens
└── docs/
    └── requirements.md     # This file
```

## Data Model

```typescript
interface Task {
  id: number;
  title: string;
  week: string;       // ISO week: "2026-W04"
  done: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;  // ISO timestamp
}
```

## Design Principles

1. **Constraint breeds creativity** - 5 tasks max, no exceptions
2. **Ship > Perfect** - Done is better than perfect
3. **History matters** - Your past weeks tell a story
4. **Local first** - Your data, your device, no cloud dependency
5. **Mobile first** - Plan your week on the go

## Running the App

```bash
# Install dependencies
npm install

# Start Expo (opens in browser)
npx expo start --web

# Or use the convenience script
./run.sh
```

## Development Notes

- Demo data auto-seeds on first launch (6 weeks of realistic history)
- To reset data, clear AsyncStorage via browser dev tools
- Week numbering follows ISO 8601 (YYYY-WNN format)

---

*Built with the "hype coder" approach: Claude implements, Ostap reviews/tests/guides.*
