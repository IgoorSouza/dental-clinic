import { FormEvent, useEffect, useState } from "react";
import show from "../assets/show.svg";
import hide from "../assets/hide.svg";
import toast from "react-hot-toast";
import Credentials from "../types/credentials";
import { api } from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function Auth(): JSX.Element {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  } as Credentials);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authData")) navigate("/");
  }, [navigate]);

  function authenticate(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (
      isStringEmpty(credentials.email) ||
      isStringEmpty(credentials.password)
    ) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    setLoading(true);

    api
      .post("/auth", credentials)
      .then(({ data }) => {
        localStorage.setItem("authData", JSON.stringify(data));
        navigate("/");
        toast.success("Login realizado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Ocorreu um erro ao fazer o login. Por favor, cheque as credenciais e tente novamente."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function isStringEmpty(string: string): boolean {
    return string.trim() === "";
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center auth-bg">
      <form
        className="px-10 py-12 bg-white rounded-lg w-[80%] max-w-[600px] z-10"
        onSubmit={authenticate}
      >
        <div className="text-center mb-5">
          <h1 className="text-4xl mb-2 mt-0">Seja bem-vindo(a)!</h1>
          <p>Por favor, faça o login antes de prosseguir.</p>
        </div>

        <div className="flex flex-col">
          <label className="ml-2 mb-[2px]" htmlFor="auth-email">
            Email
          </label>
          <input
            type="email"
            id="auth-email"
            placeholder="Insira seu email aqui..."
            className="p-3 mb-3 rounded-lg outline-none bg-slate-200"
            onChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
          />

          <label className="ml-2 mb-[2px]" htmlFor="auth-password">
            Senha
          </label>
          <div className="flex bg-slate-200 rounded-lg">
            <input
              type={showPassword ? "text" : "password"}
              id="auth-password"
              placeholder="Insira sua senha aqui..."
              className="p-3 w-full rounded-l-lg outline-none bg-slate-200"
              onChange={(event) =>
                setCredentials({ ...credentials, password: event.target.value })
              }
            />
            <img
              src={showPassword ? hide : show}
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer bg-black px-3 rounded-r-lg hover:opacity-80 transition-all duration-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-5 mx-auto p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400 ${
              loading && "opacity-80"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
