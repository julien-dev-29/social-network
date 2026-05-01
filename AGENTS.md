# Agent Coding Guidelines

This file provides guidelines for AI agents working in this repository.

---

## 1. Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start development server on port 3000
```

### Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run all tests with vitest
```

**Running a single test:**
```bash
npx vitest run path/to/test-file.test.ts
npx vitest run --grep "test name"   # Run tests matching a pattern
```

### Code Quality
```bash
npm run format       # Format code with Biome
npm run lint         # Lint code with Biome
npm run check        # Run both format and lint checks
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma database GUI
```

---

## 2. Code Style Guidelines

### General Principles
- Use TypeScript for all new code
- Avoid using `any` unless absolutely necessary
- Keep functions small and focused
- Use meaningful variable and function names

### Formatting (Biome)
- **Indentation:** Use tabs
- **Quotes:** Use double quotes for strings
- **Semicolons:** Required
- Run `npm run check` before committing

### Imports

**Order:**
1. External libraries (React, TanStack, etc.)
2. Internal path aliases (`#/*` for src/*)
3. Relative imports (`@/components/*`)

**Path aliases:**
- `#/*` → maps to `./src/*`
- `@/components/*` → maps to `./src/components/*`

### Naming Conventions
- **Variables/Functions:** camelCase (`handleSubmit`, `userId`, `isLoading`)
- **Components:** PascalCase (`PostCard`, `CreatePostDialog`)
- **Interfaces:** PascalCase (`Post`, `Like`, `User`)
- **Boolean:** prefix with `is`, `has`, `should` (`isLiked`, `hasError`)

### TypeScript Guidelines
- Define shared types in `type.d.ts` in project root
- Use interfaces for object shapes
- Use `| null` explicitly instead of optional `?`

### React Patterns

**Component Structure:**
```typescript
const ComponentName = ({ prop1, prop2 }: PropsType) => {
  const router = useRouter();
  const [state, setState] = useState("");

  const handleAction = async () => { /* implementation */ };

  return <div>...</div>;
};
```

- Use `router.invalidate()` to refresh data after mutations

### Error Handling

**Server Functions:**
- Use `ensureSession()` for authentication
- Throw descriptive errors: `throw new Error("Unauthorized")`
- Use input validators: `.inputValidator((data) => data)`

**Try/Catch:**
```typescript
const handleAction = async () => {
  try {
    await someAsyncOperation();
    router.invalidate();
  } catch (error) {
    console.error("Action failed:", error);
  }
};
```

### Tailwind CSS
- Use `cn()` utility from `#/lib/utils` for conditional classes
- Use semantic naming: `text-primary`, `bg-muted`

### Prisma Patterns
```typescript
const posts = await prisma.post.findMany({
  where: { authorId: userId },
  include: { likes: true, comments: { include: { user: true } } },
  orderBy: { createdAt: "desc" },
});
```

### File Organization
```
src/
├── components/       # React components
│   └── ui/          # Shadcn UI components
├── lib/             # Utility functions and server functions
├── routes/          # TanStack Route files
├── types.d.ts       # Shared type definitions
```

---

## 3. Testing Guidelines
- Test files: `*.test.ts` or `*.spec.ts`
- Use `@testing-library/react`
- Mock external dependencies

---

## 4. Git Conventions
- Run `npm run check` before committing
- Run `npm run build` to ensure no build errors
- Write meaningful commit messages describing the "why", not "what"

---

## 5. Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Run tests | `npm run test` |
| Single test | `npx vitest run file.test.ts` |
| Format code | `npm run format` |
| Full check | `npm run check` |
| Generate Prisma | `npx prisma generate` |
| Push DB | `npx prisma db push` |