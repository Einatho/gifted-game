# מבחן מחוננים - Gifted Test Prep Game

A cross-platform Hebrew game app for 9-year-old children to practice for the Israeli gifted students test (מבחן מחוננים ומצטיינים).

## Features

- 🧮 **Mathematical Reasoning** - Number sequences, arithmetic puzzles, word problems
- 📚 **Verbal Analogies** - Word relationships, categories, opposites
- 🔷 **Visual Patterns** - Shape sequences, rotations, pattern recognition
- 🧩 **Logic Puzzles** - Deduction, if-then reasoning, set problems

### Gamification
- ⭐ Stars and points system
- 🏆 Achievements and badges
- 📊 Progress tracking
- 🔥 Daily challenge streak
- 📈 Adaptive difficulty

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Animations**: React Native Reanimated
- **Navigation**: Expo Router

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
cd gifted-game

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on devices

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web Browser
npx expo start --web
```

## Project Structure

```
gifted-game/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   ├── game/                # Game screens
│   └── levels/              # Level selection
├── components/
│   ├── questions/           # Question type components
│   ├── game/                # Game UI components
│   └── ui/                  # Reusable UI components
├── data/
│   └── questions/           # Question banks (JSON)
├── hooks/                   # Custom React hooks
├── stores/                  # Zustand stores
├── utils/                   # Helper functions
└── assets/                  # Images, sounds, fonts
```

## Question Bank

The game includes 200+ Hebrew questions across 4 categories:

| Category | Questions | Types |
|----------|-----------|-------|
| Math | 50+ | Sequences, Arithmetic, Word Problems |
| Verbal | 50+ | Analogies, Categories, Opposites |
| Visual | 50+ | Shape Sequences, Patterns, Rotations |
| Logic | 50+ | Deduction, If-Then, Set Problems |

## Customization

### Adding Questions

Edit the JSON files in `data/questions/`:

```json
{
  "id": "math_seq_001",
  "category": "math",
  "type": "sequence",
  "difficulty": "easy",
  "timeLimit": 45,
  "points": 100,
  "questionText": "מהו המספר הבא בסדרה?",
  "sequence": [2, 4, 6, 8],
  "options": ["10", "9", "12", "11"],
  "correctAnswer": 0
}
```

### Configuring Levels

Edit `utils/constants.ts` to modify level progression:

```typescript
export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, questionsCount: 5, difficulty: 'easy', ... },
  // ...
];
```

## RTL Support

The app is fully RTL (Right-to-Left) for Hebrew language support. This is configured in:
- `app.json` - `extra.supportsRTL` and `extra.forcesRTL`
- `app/_layout.tsx` - `I18nManager.forceRTL(true)`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by the Israeli gifted students test format
- Question format based on examples from [Machon Noam](https://www.machon-noam.co.il)
- Built with ❤️ for children preparing for the מבחן מחוננים

