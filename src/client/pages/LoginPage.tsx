import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { login } from "wasp/client/auth";
import { IconMasksTheater, IconLogin2 } from "@tabler/icons-react";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import "../../index.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login({ username: email, password: senha });
      navigate("/dashboard");
    } catch {
      setErro("E-mail ou senha incorretos — verifique e tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-secondary flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pt-8">
          <div
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <IconMasksTheater size={36} stroke={1.5} />
          </div>
          <CardTitle className="text-2xl">Teatro Estadual</CardTitle>
          <CardDescription>Entrar no FigurinoApp</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-lg"
              size="lg"
              disabled={carregando}
            >
              <IconLogin2 size={20} stroke={1.5} />
              {carregando ? "Entrando..." : "Entrar"}
            </Button>

            {erro && (
              <p
                role="alert"
                className="text-base text-destructive text-center"
              >
                {erro}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
