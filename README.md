# Quote Wallpaper Generator

A small React app for turning one or more quotes into downloadable PNG wallpapers. The app renders each quote on an HTML canvas, centers the text, preserves user-entered line breaks, and downloads the generated image directly in the browser.

## Features

- Add multiple quote inputs.
- Remove extra quote inputs with an icon button.
- Pick background and text colors.
- Choose from preset wallpaper resolutions:
  - 1920x1080
  - 3840x2160
  - 1206x2622 for iPhone 16-17 Pro
- Generate one PNG per non-empty quote.
- Preserve manual line breaks from the textarea.
- Automatically wrap long lines, with earlier wrapping for horizontal wallpapers.
- Center quote text vertically and horizontally.
- Reset quote inputs after generation.
- Name downloads with the first five words of each quote, for example `qwp-stay-hungry-stay-foolish.png`.
- Keyboard shortcuts for adding quotes, deleting the focused quote, and creating wallpapers.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Base UI / shadcn-style local UI components
- Lucide React icons
- Biome for linting and formatting

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

Run linting:

```bash
pnpm lint
```

Format files:

```bash
pnpm format
```

## How It Works

1. Enter one or more quotes.
2. Pick the background color, text color, and target resolution.
3. Click **Create Wallpapers**.
4. The app creates a canvas for each non-empty quote, draws the background and centered text, then downloads the PNG.
5. The quote inputs reset after generation, while the selected colors and resolution remain selected.

## Keyboard Shortcuts

- `Ctrl+Enter` / `Cmd+Enter`: add a new quote input and focus it. If there is only one empty quote, focus that existing input instead.
- `Ctrl+Backspace` / `Cmd+Backspace`: delete the currently focused quote input.
- `Ctrl+S` / `Cmd+S`: create and download wallpapers.
