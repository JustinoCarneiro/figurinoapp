import { test, expect } from "@playwright/test";
import { OPERADORA } from "./helpers/auth";

/**
 * VS01 - Setup Wasp + login da operadora
 *
 * Criterio de aceite (PRD secao 7):
 *   "Operadora faz login e e redirecionada ao dashboard.
 *    Rota protegida sem login redireciona para /login."
 *
 * Estes testes validam a UI de login. Outros cards que precisam de operadora
 * autenticada (VS02+) devem usar `loginAsOperadora` de ./helpers/auth.
 */

test.describe("VS01 - Login da operadora", () => {
  test("login com credenciais validas redireciona para o dashboard", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel(/e-?mail/i).fill(OPERADORA.email);
    await page.getByLabel(/senha/i).fill(OPERADORA.senha);
    await page.getByRole("button", { name: /entrar/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/);
  });

  test("rota protegida acessada sem login redireciona para /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login\/?$/);
  });
});
