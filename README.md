# 🎭 SPRINT 4: Joke Generator

A modern web application that delivers random jokes from multiple sources while tracking user engagement through an interactive scoring system. Built with TypeScript, Vite, and a hybrid styling approach combining Tailwind CSS with SCSS architecture.

## ✨ Features

- **Multi-Source Jokes** - Alternates between two public APIs to provide diverse joke content
- **Interactive Scoring** - Rate jokes on a three-point scale with optional voting, visual state persistence, and toggle deselection
- **Live Weather Widget** - Displays real-time Barcelona weather using wttr.in API
- **Engagement Tracking** - Automatically logs user ratings with ISO timestamps for analytics
- **Responsive Design** - Centered grid layout that adapts seamlessly to different screen sizes
- **Comprehensive Testing** - 34 tests covering API calls, DOM manipulation, business logic, and user interactions

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development with strict mode enabled
- **Vite** - Lightning-fast build tool with Hot Module Replacement
- **Tailwind CSS v4** - Utility-first CSS framework for structural layout
- **SCSS** - 7-1 architecture pattern for refined visual styling
- **Vitest** - Modern testing framework with happy-dom environment
- **Testing Library** - User-centric testing utilities for DOM interactions

## 📁 Project Structure

```
SPRINT-4/
├── src/
│   ├── scss/
│   │   ├── abstracts/
│   │   │   ├── _index.scss
│   │   │   ├── _mixins.scss
│   │   │   └── _variables.scss
│   │   ├── base/
│   │   │   ├── _index.scss
│   │   │   ├── _reset.scss
│   │   │   └── _typography.scss
│   │   ├── components/
│   │   │   ├── _buttons.scss
│   │   │   ├── _index.scss
│   │   │   └── _weather-widget.scss
│   │   ├── layout/
│   │   │   ├── _containers.scss
│   │   │   └── _index.scss
│   │   └── main.scss
│   ├── test/
│   │   ├── api.test.ts
│   │   ├── display.test.ts
│   │   ├── helpers.ts
│   │   ├── interaction.test.ts
│   │   ├── scoring.test.ts
│   │   └── setup.ts
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js v22.20.0 or higher
- npm v11.6.2 or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd SPRINT-4
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

Navigate to `http://localhost:5173` to view the application.

### Testing

Run the test suite in watch mode:

```bash
npm run test
```

Launch the interactive test UI:

```bash
npm run test:ui
```

Generate coverage reports:

```bash
npm run test:coverage
```

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🏗️ Architecture Decisions

### Styling Strategy

The project employs a hybrid approach that leverages the strengths of both Tailwind CSS and SCSS. Tailwind handles structural layout concerns like grid positioning, flexbox alignment, and responsive spacing through utility classes. SCSS manages visual refinement including colors, shadows, transitions, and component-specific styling through the 7-1 architecture pattern that organizes styles into abstracts, base, components, and layout folders.

### State Management

The application maintains state through module-scoped variables that distinguish between temporary state like the current joke and score being viewed, and permanent state like the accumulated array of finalized joke reports. This separation ensures that user interactions remain fluid and modifiable until explicitly committed when advancing to the next joke.

### Testing Philosophy

Tests focus on four categories of functionality: asynchronous API calls that fetch data from external services, DOM manipulation functions that update the user interface, pure business logic that manages the scoring system, and user interactions that combine DOM manipulation with state management. Each test category uses appropriate helpers and mocks to create isolated, deterministic test environments that verify behavior without external dependencies.

## 📊 API Integration

- **icanhazdadjoke.com** - Primary source for jokes in plain text format
- **Official Joke API** - Secondary source providing setup/punchline structured jokes
- **wttr.in** - Weather data for Barcelona without requiring authentication

## 👤 Author

**Sergio Morey**

- IT Academy Barcelona Student
- Frontend Development Specialization

## 📄 License

This project was created as part of the IT Academy Barcelona curriculum for educational purposes.

---

🛠️ Built using modern web technologies
