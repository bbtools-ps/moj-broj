# Moj Broj

A React-based implementation of the popular Serbian numbers game "Moj Broj" (My Number), where players must reach a target number using arithmetic operations on a set of given numbers.

## About the Game

"Moj Broj" is a mathematical puzzle game where:

- A random target number (0-999) is generated
- Six numbers are provided (four single-digit numbers 1-9, one from [10, 15, 20], and one from [25, 50, 75, 100])
- Players must use basic arithmetic operations (+, -, ×, ÷) to reach the target number
- Each number can only be used once
- The game includes an automatic solver that finds the solution or the closest possible result

## Features

- 🎲 Random number generation
- 🧮 Automatic solution finder using BFS algorithm
- 🎯 Finds exact solutions or closest possible results
- ⌨️ Custom numeric inputs with validation
- 🔄 Stepper controls and mouse wheel support for number selection
- 📱 Responsive design with Tailwind CSS
- ⚡ Built with React 19 and TypeScript

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Font Awesome** - Icons
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format
```

## How to Use

1. Enter a target number (0-999) or click "Izmešaj" (Shuffle) to generate random numbers
2. The solver will automatically find a solution using the given numbers
3. You can manually adjust the available numbers using the input fields
4. Click "Rešenje" (Solution) to calculate and display the solution
5. Click "Resetuj" (Reset) to clear all values

## Algorithm

The solution finder uses a **Breadth-First Search (BFS)** algorithm:

- Generates all possible combinations of two numbers
- Applies all four arithmetic operations (+, -, ×, ÷)
- Tracks used numbers by index to prevent duplicate usage
- Validates results (no negative numbers, integers only for division)
- Returns exact match or closest result
