// Loy Krathong — one Worker serves the page and one shared river (Durable Object) for everyone.
import HTML from './index.html';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/ws') {
      if (req.headers.get('Upgrade') !== 'websocket') return new Response('expected websocket', { status: 426 });
      return env.RIVER.get(env.RIVER.idFromName('main')).fetch(req);
    }
    return new Response(HTML, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
  },
};

const MAX_PLAYERS = 150;

export class River {
  constructor(state, env) {
    this.state = state;
    this.sessions = new Map(); // id -> { ws, v, n, t }
  }

  async fetch(req) {
    const { 0: client, 1: server } = new WebSocketPair();
    server.accept();
    if (this.sessions.size >= MAX_PLAYERS) {
      server.close(1013, 'full');
      return new Response(null, { status: 101, webSocket: client });
    }
    const id = crypto.randomUUID().slice(0, 8);
    const s = { ws: server, v: null, n: 0, t: Date.now() };
    this.sessions.set(id, s);

    const peers = {};
    for (const [k, o] of this.sessions) if (k !== id && o.v) peers[k] = o.v;
    server.send(JSON.stringify({ t: 'hi', id, peers }));

    server.addEventListener('message', (e) => {
      if (typeof e.data !== 'string' || e.data.length > 4096) return;
      const now = Date.now();
      if (now - s.t > 1000) { s.t = now; s.n = 0; }
      if (++s.n > 30) return; // simple flood guard
      let d;
      try { d = JSON.parse(e.data); } catch { return; }
      if (d && d.t === 'p' && d.v && typeof d.v === 'object' && !Array.isArray(d.v)) {
        s.v = d.v;
        this.broadcast({ t: 'p', id, v: d.v }, id);
      }
    });
    const bye = () => { if (this.sessions.delete(id)) this.broadcast({ t: 'bye', id }); };
    server.addEventListener('close', bye);
    server.addEventListener('error', bye);

    return new Response(null, { status: 101, webSocket: client });
  }

  broadcast(msg, except) {
    const json = JSON.stringify(msg);
    for (const [k, o] of this.sessions) {
      if (k === except) continue;
      try { o.ws.send(json); } catch { this.sessions.delete(k); }
    }
  }
}
