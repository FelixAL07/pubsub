# PubSub chat

A small SvelteKit chat app for testing Azure Web PubSub.

The app lets a user enter a username, connect to Azure Web PubSub, join a shared group, and send JSON chat messages to everyone else in that group.

## How it works

- The Svelte page at `src/routes/+page.svelte` starts a Web PubSub client on mount.
- The browser calls `GET /api/token` to request a short-lived Azure Web PubSub client token.
- `src/routes/api/token/+server.ts` creates that token with `WebPubSubServiceClient`.
- The client joins the hard-coded group `group-1`.
- Messages are sent to `group-1` as JSON:

```json
{
	"userName": "Ada",
	"message": "Hello"
}
```

Incoming `group-message` events are rendered in the message log.

## Tech stack

- SvelteKit 2
- Svelte 5 with runes enabled
- Vite
- TypeScript
- Azure Web PubSub SDKs:
  - `@azure/web-pubsub`
  - `@azure/web-pubsub-client`

## Requirements

- Node.js and npm
- An Azure Web PubSub resource
- A Web PubSub connection string

The server route currently uses hub name `Hub` and grants client tokens these roles for 60 minutes:

- `webpubsub.joinLeaveGroup`
- `webpubsub.sendToGroup`

## Environment

Create a local `.env` file with:

```env
PUBLIC_AZURE_PUBSUB_CONNECTION_STRING="Endpoint=...;AccessKey=...;Version=1.0;"
```

The variable name is public-prefixed because that is what the current server route imports. Treat the value as a secret anyway and keep `.env` out of git.

`PUBLIC_AZURE_PUBSUB_URL` may exist in local environments, but the current app does not read it.

## Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

The Vite dev server is configured for port `5173` and listens on `0.0.0.0`, so the app is available at:

```text
http://localhost:5173
```

The config also allows `.devtunnels.ms` hosts for tunnel-based testing.

## Available scripts

```sh
npm run dev          # start the local dev server
npm run build        # build the app
npm run preview      # preview the production build
npm run check        # run Svelte and TypeScript checks
npm run check:watch  # run checks in watch mode
npm run format       # format files with Prettier
npm run format:check # check formatting
```

## Project structure

```text
src/routes/+page.svelte            Chat UI and send-message handling
src/routes/api/token/+server.ts    Azure Web PubSub token endpoint
src/lib/service.ts                 Web PubSub client helpers
src/lib/types.ts                   Shared message type
vite.config.ts                     SvelteKit, dev server, and adapter config
```

## Notes

- All users currently share the same Web PubSub group: `group-1`.
- The app does not persist messages; messages only appear while clients are connected.
- Empty usernames are displayed as `Anonymous`.
- Deployment uses `@sveltejs/adapter-auto`; switch adapters if the target host requires a specific SvelteKit adapter.
