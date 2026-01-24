# Claude Code Guidelines

## Communication
- Keep responses concise and to the point
- Focus on what's relevant to the task at hand
- Avoid unnecessary explanations unless asked

## Code Standards
- Follow React Native and TypeScript best practices
- Use functional components with hooks
- Maintain consistent styling with existing codebase (StyleSheet API)
- Keep components small and focused on a single responsibility
- Use proper TypeScript types - avoid `any`

## Project Structure
- Components go in `src/components/`
- Types and interfaces in `src/types.ts`
- Database/storage logic in `src/database.ts`
- Main app entry in `App.tsx`

## Tech Stack
- React Native with Expo SDK 54
- TypeScript
- AsyncStorage for persistence
- Supports web, iOS, and Android
