import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/axios";
import User from "../types/user";
import Role from "../types/role";
import show from "../assets/show.svg";
import hide from "../assets/hide.svg";
import close from "../assets/close.svg";
import { useClickAway } from "react-use";
import loadingIcon from "../assets/loading.svg";

export default function Users(): JSX.Element {
  const [users, setUsers] = useState<User[]>([] as User[]);
  const [id, setId] = useState<string | undefined>();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<Role>(Role.ADMIN);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const authData = JSON.parse(localStorage.getItem("authData")!);
  const navigate = useNavigate();

  useEffect(() => {
    if (authData.role === Role.ADMIN) {
      navigate("/");
      toast.error("Você não possui permissão para acessar essa página.");
    }

    api.get("/users").then(({ data: users }) => {
      setUsers(users);
      setLoading(false);
    });
  }, [navigate, authData.role]);

  useClickAway(modalRef, () => setShowModal(false));

  function createUser(): void {
    if (
      isStringEmpty(name) ||
      isStringEmpty(email) ||
      isStringEmpty(password)
    ) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    setLoading(true);

    const newUser = {
      name,
      email,
      password,
      role,
    };

    api
      .post("/users/new", newUser)
      .then(({ data }) => {
        setShowModal(false);
        setShowPassword(false);
        setUsers([...users, data]);
        clear();
        toast.success("Usuário criado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao criar usuário. Por favor, verifique os dados e tente novamente."
        );
      })
      .finally(() => setLoading(false));
  }

  function updateUser(): void {
    if (isStringEmpty(name) || isStringEmpty(email)) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    setLoading(true);

    const newUser = {
      id,
      name,
      email,
      password,
      role,
    };

    api
      .put("/users/update", newUser)
      .then(({ data }) => {
        const updatedUserIndex = users.findIndex((user) => user.id === id);
        const updatedUsers = [...users];
        updatedUsers[updatedUserIndex] = data;
        setUsers(updatedUsers);
        setShowModal(false);
        setShowPassword(false);
        clear();
        toast.success("Usuário atualizado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao atualizar usuário. Por favor, verifique os dados e tente novamente."
        );
      })
      .finally(() => setLoading(false));
  }

  function deleteUser(userId: string): void {
    setLoading(true);

    api
      .delete(`/users/delete/${userId}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setShowModal(false);
        setShowPassword(false);
        clear();
        toast.success("Usuário excluído com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao excluir usuário. Por favor, tente novamente mais tarde."
        );
      })
      .finally(() => setLoading(false));
  }

  function clear(): void {
    setId(undefined);
    setName("");
    setEmail("");
    setPassword("");
    setRole(Role.ADMIN);
  }

  function isStringEmpty(string: string): boolean {
    return string.trim() === "";
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-start">
        <img src={loadingIcon} className="w-24 animate-spin mt-40" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl mt-16 mb-8 text-center">Usuários do sistema</h1>

      <div className="h-screen flex flex-col max-w-[800px] mx-auto">
        <button
          type="button"
          className="mt-3 mb-5 ml-auto px-3 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-all duration-400"
          onClick={() => setShowModal(true)}
        >
          Novo usuário
        </button>

        <table className="w-full border-collapse self-center">
          <thead>
            <tr>
              <th className="px-4 py-3 border-slate-300">Nome</th>
              <th className="px-4 py-3 border-slate-300">Email</th>
              <th className="px-4 py-2 border-slate-300">Cargo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr
                className="hover:cursor-pointer hover:bg-slate-200 transition-all duration-400"
                key={user.id}
                onClick={() => {
                  if (user.role === Role.OWNER) return;

                  setId(user.id);
                  setName(user.name);
                  setEmail(user.email);
                  setRole(user.role);
                  setShowModal(true);
                }}
              >
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {user.name}
                </td>
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {user.email}
                </td>
                <td className="border-t px-4 py-2 border-slate-300 text-center">
                  {user.role === Role.OWNER
                    ? "Dono"
                    : user.role === Role.SUPERADMIN
                    ? "Super Administrador"
                    : "Administrador"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div
            className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-[600px]"
            ref={modalRef}
          >
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4">Detalhes do Usuário</h2>
              <img
                src={close}
                className="size-8 cursor-pointer"
                onClick={() => {
                  setShowModal(false);
                  setShowPassword(false);
                  clear();
                }}
              />
            </div>

            <form>
              <div className="flex flex-col">
                <label className="ml-2 mb-1" htmlFor="user-name">
                  Nome<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="user-name"
                  placeholder="Insira o nome aqui..."
                  className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                  value={name}
                  maxLength={50}
                  onChange={(event) => setName(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="user-email">
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="user-email"
                  placeholder="Insira o email aqui..."
                  className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                  value={email}
                  maxLength={50}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="user-password">
                  Senha {!id && <span className="text-red-600">*</span>}
                </label>
                <div className="flex bg-white rounded-lg mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="user-password"
                    placeholder="Insira a senha aqui..."
                    className="p-3 w-full rounded-l-lg outline-none bg-slate-200"
                    maxLength={30}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <img
                    src={showPassword ? hide : show}
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer bg-black px-3 rounded-r-lg hover:opacity-80 transition-all duration-400"
                  />
                </div>

                <label className="ml-2 mb-1">Cargo</label>
                <select
                  className="p-3 mb-3 rounded-lg outline-none bg-slate-200"
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                >
                  {role === Role.OWNER && (
                    <option value={Role.OWNER}>Dono</option>
                  )}
                  <option value={Role.ADMIN}>Administrador</option>
                  <option value={Role.SUPERADMIN}>Super Administrador</option>
                </select>

                {!id && (
                  <div className="flex justify-end gap-x-4">
                    <button
                      type="button"
                      className="mt-5 p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                      onClick={createUser}
                    >
                      Criar
                    </button>
                  </div>
                )}

                {id && role !== Role.OWNER && (
                  <div className="flex justify-end gap-x-4">
                    <button
                      type="button"
                      className="mt-5 p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                      onClick={updateUser}
                    >
                      Atualizar
                    </button>

                    {email !== authData.email && (
                      <button
                        type="button"
                        className="mt-5 p-2 bg-red-500 text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                        onClick={() => deleteUser(id!)}
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
