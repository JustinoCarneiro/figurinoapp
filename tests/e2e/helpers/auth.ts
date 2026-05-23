import { type Page, expect } from "@playwright/test";

/**
 * Credenciais da operadora seed (RF01 - sem auto-cadastro).
 * Criadas em src/server/seeds/operadora.ts e injetadas via `wasp db seed`.
 */
export const OPERADORA = {
  email: "operadora@teatroestadual.gov.br",
  senha: "OperadoraFigurino123",
} as const;

/**
 * Loga uma operadora pela UI e aguarda o redirect para /dashboard.
 * Use em todo teste que depende de operadora autenticada.
 */
export async function loginAsOperadora(page: Page): Promise<void> {
  await page.goto("/login");
  await page.getByLabel(/e-?mail/i).fill(OPERADORA.email);
  await page.getByLabel(/senha/i).fill(OPERADORA.senha);
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/?$/);
}

/**
 * Desloga a operadora limpando o storage do navegador.
 * Wasp guarda o sessionId em localStorage; remover invalida a sessao do cliente.
 */
export async function logout(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}
