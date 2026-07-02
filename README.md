# co.stil

The studio of Collin Stilwell — design-first software and physical objects, one continuous practice.

One continuous practice, two wings:

- **Software** — Ray (auction market intelligence), Soirée (NYC event discovery), SecMCPHub, Elixir security tooling
- **Physical** — Project 1122 (full residence), 3D-printed lighting and furniture

## Development

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

## Tech Stack

- Next.js 14 / React 18 / TypeScript (inline-style React + CSS custom properties)
- Three.js (Möbius strip hero, STL viewers)
- Recharts (Ray analytics)

## Project Structure

- `/app` — Next.js app directory (home, `/software`, `/software/ray`, `/physical`, `/physical/1122`, `/physical/prints`, `/about`)
- `/app/components` — shared components; `sections.ts` is the data core driving the index pages
- `/public` — static assets and STL models

## Design Philosophy

Built on the Möbius strip — a surface with one side and one boundary. No divide between the code and the object it becomes: software designed like objects, objects informed by software.

## License

MIT
