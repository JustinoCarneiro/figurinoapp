import type { DbSeedFn } from "wasp/server";
import {
  createProviderId,
  createUser,
  findAuthIdentity,
  sanitizeAndSerializeProviderData,
} from "wasp/server/auth";

const OPERADORA_USERNAME = "operadora@teatroestadual.gov.br";
const OPERADORA_SENHA = "OperadoraFigurino123";

export const seedOperadora: DbSeedFn = async () => {
  const providerId = createProviderId("username", OPERADORA_USERNAME);

  if (await findAuthIdentity(providerId)) {
    return;
  }

  const providerData = await sanitizeAndSerializeProviderData<"username">({
    hashedPassword: OPERADORA_SENHA,
  });

  await createUser(providerId, providerData, {});
};
