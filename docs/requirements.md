# Q2 Focus - Reclaim What Matters

> A reflection app for leaders who are tired of firefighting and ready to invest in what actually matters.

---

## The Problem

You're a leader. Your calendar is full. Your day is reactive:
- **Morning**: Check Slack, respond to "urgent" requests
- **Midday**: Back-to-back meetings, most of which you didn't initiate
- **Afternoon**: Finally start on that strategic doc... interrupted 4 times
- **Evening**: "Where did my day go?"

Sound familiar?

The Eisenhower Matrix tells us there are 4 quadrants:

```
                    URGENT              NOT URGENT
              ┌─────────────────┬─────────────────┐
   IMPORTANT  │      Q1         │      Q2         │
              │   Firefighting  │   GROWTH ZONE   │
              │   Deadlines     │   Strategy      │
              │   Crises        │   Relationships │
              │                 │   Learning      │
              │   (Survival)    │   (Thriving)    │
              ├─────────────────┼─────────────────┤
 NOT IMPORTANT│      Q3         │      Q4         │
              │   Interruptions │   Time wasters  │
              │   Some meetings │   Busy work     │
              │   Others' fires │   Avoidance     │
              │                 │                 │
              │   (Deception)   │   (Waste)       │
              └─────────────────┴─────────────────┘
```

**The trap**: Q1 feels productive. Q3 feels helpful. Q4 feels deserved after a hard day.

**The truth**: Q2 is where your career, health, relationships, and leadership grow. But it never screams for attention. It waits quietly until it becomes Q1 (a crisis).

---

## The Solution

**Q2 Focus** is not a task manager. It's a **reflection tool** that:

1. **Tracks where your time actually goes** - quick daily logging
2. **Reveals your patterns** - are you living in Q1? Trapped in Q3?
3. **Nudges you toward Q2** - gentle accountability to do what matters
4. **Celebrates Q2 wins** - because no one else will notice you spent 2 hours on strategy

---

## Core Concept: Daily Reflection

**Why daily, not weekly?**
- You can't remember Tuesday's tasks by Friday
- Daily habit = faster feedback loop
- Small adjustments compound
- 2-3 minutes at end of day is sustainable

**The Daily Flow:**

```
End of Day (2-3 min):
┌────────────────────────────────────────────┐
│  What did you spend time on today?         │
│                                            │
│  [Quick add task] ────────────────────►    │
│                                            │
│  Today's Tasks:                            │
│  ┌──────────────────────────────────────┐  │
│  │ ● Team standup           [Q3] [30m]  │  │
│  │ ● Fixed prod bug         [Q1] [2h]   │  │
│  │ ● 1:1 with Sarah         [Q2] [45m]  │  │
│  │ ● Slack/email triage     [Q3] [1h]   │  │
│  │ ● Strategic roadmap doc  [Q2] [1h]   │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Today's Q2 Time: 1h 45m (25%) ████░░░░░░  │
│  Goal: 40%                                 │
└────────────────────────────────────────────┘
```

---

## Features

### Phase 1: Daily Capture & Reflect

- [ ] **Quick task entry** - What did you do? (title + optional duration)
- [ ] **One-tap quadrant assignment** - Swipe or tap Q1/Q2/Q3/Q4
- [ ] **Daily summary** - See today's quadrant breakdown
- [ ] **Q2 percentage** - The core metric: % of day in Q2

### Phase 2: Patterns & Insights

- [ ] **Weekly summary** - Quadrant distribution over the week
- [ ] **Trend charts** - Is your Q2% improving over time?
- [ ] **Category tags** - Meetings, Deep Work, Admin, 1:1s, Learning
- [ ] **Insights** - "You spent 60% in Q1 this week. Consider delegating more."

### Phase 3: Proactive Planning

- [ ] **Tomorrow's intentions** - Plan Q2 blocks before the day starts
- [ ] **Q2 goals** - "I want to spend 40% of my time in Q2"
- [ ] **Streaks** - Days in a row hitting your Q2 goal
- [ ] **Weekly review prompts** - "What Q1 tasks could become Q2 with better planning?"

### Future Ideas

- [ ] Calendar integration - auto-import meetings, you classify them
- [ ] Smart suggestions - "This looks like a Q3 task, could you delegate?"
- [ ] Export/reports - for personal retrospectives
- [ ] Team mode - anonymous Q2 scores for leadership teams

---

## UX Principles

1. **Speed over completeness** - Log 5 things imperfectly > log nothing
2. **Reflection, not planning** - This isn't a todo list, it's a mirror
3. **Q2 as the hero** - UI should celebrate Q2 time, not just show it
4. **No guilt, just awareness** - Bad days happen, the goal is patterns
5. **Mobile-first** - Log on the go, reflect on the couch

### UX Flow: Adding a Task (must be < 10 seconds)

```
[Text input: "What did you do?"]
     ↓ type title, tap enter
[Quadrant row: Q1 | Q2 | Q3 | Q4] ← one tap
     ↓
[Category pills: Meeting | Deep Work | 1:1 | ...] ← one tap
     ↓
[Duration presets: 15m | 30m | 1h | 2h | custom] ← one tap
     ↓
[Add] → done, task appears in list
```

**Key UX details:**
- Smart defaults: last-used category pre-selected
- Duration defaults to 30m (most common)
- Quadrant defaults to nothing (forces conscious choice)
- Swipe to delete, tap to edit
- No modals, no extra screens - all inline

---

## Quadrant Quick Reference

| Quadrant | Examples | Action |
|----------|----------|--------|
| **Q1** (Urgent + Important) | Production down, deadline today, sick kid | Do it, but ask: could planning prevent this? |
| **Q2** (Not Urgent + Important) | Strategy, 1:1s, learning, exercise, planning | **PROTECT THIS TIME** |
| **Q3** (Urgent + Not Important) | Most meetings, Slack "urgent", others' priorities | Delegate, say no, batch |
| **Q4** (Not Urgent + Not Important) | Social media, busywork, unnecessary reports | Eliminate or timebox |

---

## Technical Approach

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo |
| Language | TypeScript |
| Storage | AsyncStorage (local-first) |
| Platforms | iOS, Android, Web |

### Data Model

```typescript
// Categories - managed separately, reused across tasks
interface Category {
  id: string;
  name: string;           // "Deep Work", "Meetings", "1:1s"
  color: string;          // hex color for visual coding
  icon?: string;          // optional emoji
  createdAt: string;
}

// Individual task/activity entry
interface TaskEntry {
  id: string;
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  categoryId: string;     // references Category.id
  duration: number;       // minutes (required for % calculations)
  date: string;           // "2026-01-23"
  createdAt: string;
}

// Calculated summaries (not stored, computed on read)
interface DaySummary {
  date: string;
  tasks: TaskEntry[];
  totalMinutes: number;
  quadrantMinutes: { q1: number; q2: number; q3: number; q4: number };
  q2Percentage: number;   // (q2 minutes / total minutes) * 100
}

interface WeekSummary {
  weekStart: string;
  days: DaySummary[];
  totalMinutes: number;
  quadrantMinutes: { q1: number; q2: number; q3: number; q4: number };
  q2Percentage: number;
  categoryBreakdown: Record<string, number>;  // categoryId -> minutes
}
```

### Default Categories (seeded on first launch)

| Category | Color | Typical Quadrant |
|----------|-------|------------------|
| Deep Work | #8b5cf6 (purple) | Q2 |
| Meetings | #f59e0b (amber) | Q3 |
| 1:1s | #10b981 (green) | Q2 |
| Admin | #6b7280 (gray) | Q3/Q4 |
| Firefighting | #ef4444 (red) | Q1 |
| Learning | #3b82f6 (blue) | Q2 |
| Planning | #8b5cf6 (purple) | Q2 |
| Email/Slack | #f59e0b (amber) | Q3 |

---

## App Name Options

"Weekly Five" no longer fits. Candidates:

| Name | Vibe |
|------|------|
| **Q2 Focus** | Direct, clear purpose |
| **The Important** | Philosophical, Covey-inspired |
| **Quadrant** | Clean, minimal |
| **Deep Focus** | Emphasizes intentionality |
| **Reclaim** | Action-oriented |

**Current choice: Q2 Focus** (clear, memorable, explains itself)

---

## Success Metrics

For the user:
- Q2 percentage trending up over weeks
- Fewer "where did my day go?" moments
- Conscious choices about Q3/Q4 time

For the app:
- Daily active usage (logging streak)
- Time to log a day (< 2 minutes)
- Weekly review completion rate

---

## MVP Scope

### Phase 1: Core Loop

**Tab 1: Today**
- Quick task entry (title + quadrant + category + duration)
- One-tap quadrant selection (Q1/Q2/Q3/Q4 buttons)
- Category dropdown (from your predefined list)
- Duration picker (quick presets: 15m, 30m, 1h, 2h, or custom)
- Today's task list with Q2% progress
- Visual breakdown (mini bar or pie)

**Tab 2: History**
- List of past days with Q2% for each
- Tap to expand and see tasks
- Weekly summary cards
- Trend indicator (up/down arrow)

**Tab 3: Categories**
- Manage your categories (CRUD)
- Examples: Meetings, Deep Work, 1:1s, Admin, Learning, Firefighting
- Color coding per category (optional)
- Used in task entry dropdown

### Phase 2: Planning & Insights

- Morning intentions (plan Q2 blocks before the day)
- Weekly summary with quadrant breakdown chart
- Insights: "You spent 60% in Q1 this week"
- Streaks: days hitting your Q2 goal

### Phase 3: Polish

- Trend charts over weeks/months
- Export data
- Notifications/reminders
- Smart suggestions

---

## The Philosophy

This app isn't about productivity theater or optimizing every minute.

It's about **one question**:

> Am I investing in what actually matters, or just responding to what's loudest?

Most leaders already know the answer. They just need a mirror.

---

*"The key is not to prioritize what's on your schedule, but to schedule your priorities."*
— Stephen Covey
