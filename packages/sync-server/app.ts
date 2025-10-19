// Compatibility shim: some code may import { run } from "./app".
// The real server boots in src/app.ts (which calls app.listen()).

import "./src/app";

export async function run(): Promise<void> {
  // No-op: importing "./src/app" starts the server.
}
