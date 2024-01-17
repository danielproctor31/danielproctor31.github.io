# danielproctor31.github.io

Github pages site for [danielproctor.dev](https://danielproctor.dev)

Uses:

- [Astro](https://astro.build/)
- [astro-paper](https://github.com/satnaing/astro-paper)
- [TinaCMS](https://tina.io)

Use the devcontainer with Docker and VSCode to get started. Alternatively install NodeJS (v20).

once setup, from `src` run:

```bash
npm ci
```

To start dev, run:

```bash
npm run dev
```

Website: [http://localhost:4321](http://localhost:4321/)

## Production Build

If using TinaCMS the following env variables are required:
```
TINA_CLIENT_ID=
TINA_TOKEN=
TINA_INDEXER_TOKEN=
TINA_BRANCH=main
```

From `src` run:

```bash
npm run build:tina # optional if using TinaCMS
npm run build:prod
```

TinaCMS can be accessed from `/admin/index.html`

Alternatively there is a also a docker build, from the root directory run:

```bash
docker compose up -d
```