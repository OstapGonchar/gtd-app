# Q2 Focus

A personal time tracking app based on the **Eisenhower Matrix** - helping you spend more time on what truly matters.

## The Eisenhower Matrix

The Eisenhower Matrix (also known as the Urgent-Important Matrix) is a productivity framework that categorizes tasks into four quadrants:

```
                     URGENT              NOT URGENT
               ┌──────────────────┬──────────────────┐
               │                  │                  │
   IMPORTANT   │       Q1         │       Q2         │
               │    DO FIRST      │     SCHEDULE     │
               │                  │                  │
               │  - Crises        │  - Planning      │
               │  - Deadlines     │  - Learning      │
               │  - Emergencies   │  - Relationships │
               │                  │  - Exercise      │
               ├──────────────────┼──────────────────┤
               │                  │                  │
 NOT IMPORTANT │       Q3         │       Q4         │
               │    DELEGATE      │    ELIMINATE     │
               │                  │                  │
               │  - Interruptions │  - Time wasters  │
               │  - Some meetings │  - Busy work     │
               │  - Some emails   │  - Distractions  │
               │                  │                  │
               └──────────────────┴──────────────────┘
```

### Why Focus on Q2?

**Q2 (Important, Not Urgent)** is where the magic happens:

- **Q1** tasks demand immediate attention but are often reactive
- **Q2** tasks build your future - skills, relationships, health, strategy
- **Q3** tasks feel urgent but don't move the needle
- **Q4** tasks are pure time drains

Most people spend too much time in Q1 (firefighting) and Q3 (busywork), while neglecting Q2. This app helps you track where your time actually goes and nudges you toward more Q2 activities.

### The Goal

Aim for **30%+ of your time in Q2**. This means you're investing in growth rather than just reacting to urgency.

## Features

- **Daily Activity Logging** - Track what you work on with quadrant, category, and duration
- **Calendar History** - Visual month view showing your Q2 focus over time
- **Streak Tracking** - Build consistency with daily activity streaks
- **Custom Categories** - Create categories with icons that match your work
- **Configurable Durations** - Set your own duration presets
- **Q2 Score** - See your daily/monthly Q2 percentage at a glance

## Tech Stack

- React Native with Expo SDK 54
- TypeScript
- AsyncStorage for local persistence
- Supports Web, iOS, and Android

## Getting Started

```bash
# Install dependencies
npm install

# Start the app
npx expo start --web
```

## Development

```bash
# Run in development mode (enables DevTools)
npx expo start --web

# Use DevTools at the bottom to:
# - Load 2 months of demo data
# - Clear all data
```

## License

MIT
