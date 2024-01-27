import { registerWs } from "./ws";

Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  }, // upgrade logic
  websocket: registerWs(),
  port: 3000,
});
