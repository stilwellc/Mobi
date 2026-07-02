# co.stil

The studio of Collin Stilwell — design-first software and physical objects, one continuous practice.

co.stil is the merger of two projects: **collin** (a personal portfolio for security engineering work) and **Mobi** (a design studio for physical spaces, objects, and digital products). The result is a single super app with two wings:

- **Software** — Ray (auction market intelligence), Soirée (NYC event discovery), SecMCPHub, Elixir security tooling
- **Physical** — Project 1122, 3D-printed fabrications, curation, and restoration work

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

- Next.js 14 / React 18 / TypeScript
- Tailwind CSS
- Three.js (Möbius strip hero, STL viewers)
- Framer Motion

## Project Structure

- `/app` — Next.js app directory (home, `/digital/ray`, `/digital/3d-prints`, `/physical/1122`, `/shop`)
- `/app/components` — shared components; `sections.ts` is the data core driving the directory, nav, and footer
- `/public` — static assets and STL models

## Design Philosophy

Built on the Möbius strip — a surface with one side and one boundary. No divide between the code and the object it becomes: software designed like objects, objects informed by software.

## License

MIT
