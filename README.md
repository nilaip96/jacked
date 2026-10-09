# JACKED

Multiplayer blackjack with chat, built with React, Express and Socket.IO.

Live at [jacked-1.onrender.com](https://jacked-1.onrender.com) (Render free tier, so the first load after idling can take ~30s).

<img width="1440" alt="Screenshot 2024-02-26 at 9 48 23 PM" src="https://github.com/nilaip96/jacked/assets/74117524/c9778d92-df95-43d1-a670-0ffcedeb9193">
<img width="1068" alt="Screenshot 2024-02-26 at 9 54 12 PM" src="https://github.com/nilaip96/jacked/assets/74117524/ba2000ee-c99d-4d06-a737-a3fc3c386428">

## Running locally

Requires Node 18+.

```bash
npm install
```

### Development (hot reload)

Run these in two terminals:

```bash
npm run server   # API + sockets on http://localhost:3000 (nodemon)
npm start        # React dev server on http://localhost:3001
```

Open http://localhost:3001.

### Production build

```bash
npm run build
npm run production
```

Open http://localhost:3000. The Express server serves the built client and the client connects to the socket server on the same origin. Set `PORT` to use a different port.

### Tests

```bash
npm test
```

## Deploy

The `master` branch is connected to Render, so anything pushed to `master` is deployed automatically. Render should build with `npm install && npm run build` and start with `npm run production`.
