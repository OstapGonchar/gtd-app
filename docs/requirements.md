# GTD Weekly Planner - Requirements

## Problem Statement
As a Head of Technology who spends most time helping others, I need a tool to plan and track my top 3-5 personal tasks for the week to ensure I make progress on my own goals.

## Core Requirements

### Must Have (MVP)
- [ ] Plan 3-5 tasks for the upcoming week
- [ ] Mark tasks as done/not-done
- [ ] View current week's tasks
- [ ] View history of past weeks (retrospection/motivation)
- [ ] Local storage (no backend/deployment)

### Nice to Have (Post-MVP)
- [ ] Task priority levels
- [ ] Eisenhower matrix view (urgent/important quadrants)
- [ ] Weekly completion stats/streaks
- [ ] Notes/details per task

## Technical Decisions

### Platform Options

| Option | Pros | Cons |
|--------|------|------|
| **A: Python + Streamlit + SQLite** | Fast to build, simple, local | Desktop only, not on phone |
| **B: React Native + local storage** | Cross-platform, runs on Pixel | More complex, learning curve |

**Decision**: Option A (Python + Streamlit + SQLite) for MVP. Port to React Native later if needed.

### Storage
- Local-first (SQLite or AsyncStorage/SQLite on mobile)
- No cloud sync for MVP
- Data persists on device

## Open Questions
1. Week workflow - start planning Sunday or Monday?
2. How to handle tasks that roll over to next week?
3. Simple list vs Eisenhower matrix for MVP?

## User Stories

### MVP
1. As a user, I can add a task for the current week
2. As a user, I can mark a task as complete
3. As a user, I can see my current week's tasks
4. As a user, I can browse past weeks to see what I accomplished

---

## Notes
- Keep it simple - this is a personal tool
- "Hype coder" approach: Claude implements, Ostap reviews/tests/guides
