import { execSync } from "node:child_process";

/**
 * Mata listeners orfaos (vite, nodemon, bundles do wasp) que possam ter
 * sobrevivido a quedas anteriores do `wasp start`. Sem isto, runs subsequentes
 * acabam servidos por um processo zumbi com codigo antigo, levando a
 * "404 no /auth/username/login" e falhas falsas de teste.
 *
 * Roda 1x ao final da suite Playwright.
 */
export default async function globalTeardown(): Promise<void> {
  const portas = ["3000", "3001"];
  for (const porta of portas) {
    try {
      const out = execSync(`ss -tlnp 2>/dev/null | grep ':${porta} ' || true`, {
        encoding: "utf-8",
      });
      const match = out.match(/pid=(\d+)/);
      if (!match) continue;
      const pid = match[1];
      // So mata se for processo de dev do wasp (vite/nodemon/node), nunca outros.
      const comm = execSync(`ps -p ${pid} -o comm= 2>/dev/null || true`, {
        encoding: "utf-8",
      }).trim();
      if (/^(node|vite|nodemon|wasp)/i.test(comm)) {
        try {
          execSync(`kill -9 ${pid} 2>/dev/null`);
          console.log(
            `[global-teardown] porta ${porta} → liberada (matou ${comm} PID ${pid})`,
          );
        } catch {
          /* sem perms ou ja morreu */
        }
      }
    } catch {
      /* porta livre ou ss indisponivel */
    }
  }
}
