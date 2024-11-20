import { useEffect, useState } from "react";
import { api } from "../utils/axios";
import Customer from "../types/customer";
import close from "../assets/close.svg";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";

export default function Customers(): JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([] as Customer[]);
  const [id, setId] = useState<string | undefined>();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string | undefined>();
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    api.get("/customers").then(({ data: customers }) => {
      setCustomers(customers);
    });
  }, []);

  function createCustomer(): void {
    if (isStringEmpty(name) || isStringEmpty(phone)) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    const newCustomer: Customer = {
      name,
      phone,
      email,
      birthDate,
      description,
    };

    api
      .post("/customers/new", newCustomer)
      .then(({ data }) => {
        setCustomers([...customers, data]);
        setShowModal(false);
        clear();
        toast.success("Cliente criado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao criar cliente. Por favor, verifique os dados e tente novamente."
        );
      });
  }

  function updateCustomer(): void {
    if (isStringEmpty(name) || isStringEmpty(phone)) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    const newCustomer: Customer = {
      id,
      name,
      phone,
      email,
      birthDate,
      description,
    };

    api
      .put("/customers/update", newCustomer)
      .then(({ data }) => {
        const updatedCustomerIndex = customers.findIndex(
          (customer) => customer.id === id
        );
        const updatedCustomers = [...customers];
        updatedCustomers[updatedCustomerIndex] = data;
        setCustomers(updatedCustomers);
        setShowModal(false);
        clear();
        toast.success("Cliente atualizado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao atualizar cliente. Por favor, verifique os dados e tente novamente."
        );
      });
  }

  function deleteCustomer(id: string): void {
    api
      .delete(`/customers/delete/${id}`)
      .then(() => {
        const updatedCustomers = customers.filter((user) => user.id !== id);
        setCustomers(updatedCustomers);
        setShowModal(false);
        clear();
        toast.success("Cliente excluído com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao excluir cliente. Por favor, tente novamente.");
      });
  }

  function clear(): void {
    setId(undefined);
    setName("");
    setPhone("");
    setEmail(undefined);
    setBirthDate(undefined);
    setDescription(undefined);
  }

  function isStringEmpty(string: string): boolean {
    return string.trim() === "";
  }

  return (
    <>
      <h1 className="text-4xl mt-16 mb-8 text-center">Clientes</h1>

      <div className="h-screen flex flex-col max-w-[800px] mx-auto">
        <button
          type="button"
          className="mt-3 mb-5 ml-auto px-3 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-all duration-400"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Novo Cliente
        </button>

        <table className="w-full border-collapse self-center">
          <thead>
            <tr>
              <th className="px-4 py-3 border-slate-300">Nome</th>
              <th className="px-4 py-2 border-slate-300">Telefone</th>
              <th className="px-4 py-2 border-slate-300">Email</th>
              <th className="px-4 py-2 border-slate-300">Data de nascimento</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: Customer) => (
              <tr
                className="hover:cursor-pointer hover:bg-slate-200 transition-all duration-400"
                key={customer.id}
                onClick={() => {
                  setId(customer.id!);
                  setName(customer.name);
                  setPhone(customer.phone);
                  setEmail(customer.email!);
                  setBirthDate(customer.birthDate!);
                  setDescription(customer.description!);
                  setShowModal(true);
                }}
              >
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {customer.name}
                </td>
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {customer.phone}
                </td>
                <td className="border-t px-4 py-2 border-slate-300 text-center">
                  {customer.email}
                </td>
                <td className="border-t px-4 py-2 border-slate-300 text-center">
                  {customer.birthDate
                    ? format(
                        parseISO(customer.birthDate.toString()),
                        "dd/MM/yyyy"
                      )
                    : undefined}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-[600px]">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4">Detalhes do Cliente</h2>
              <img
                src={close}
                className="size-8 cursor-pointer"
                onClick={() => {
                  clear();
                  setShowModal(false);
                }}
              />
            </div>

            <form>
              <div className="flex flex-col">
                <label className="ml-2 mb-1" htmlFor="customer-name">
                  Nome<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="customer-name"
                  placeholder="Insira o nome aqui..."
                  className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                  value={name}
                  maxLength={50}
                  onChange={(event) => setName(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="customer-phone">
                  Telefone<span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="customer-phone"
                  placeholder="Insira o telefone aqui..."
                  className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                  value={phone}
                  maxLength={15}
                  onChange={(event) => setPhone(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="customer-email">
                  Email
                </label>
                <input
                  type="email"
                  id="customer-email"
                  placeholder="Insira o email aqui..."
                  className="p-3 mb-4 w-full rounded-lg outline-none bg-slate-200"
                  value={email}
                  maxLength={50}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="customer-birthdate">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  id="customer-birthdate"
                  className="p-3 mb-3 rounded-lg outline-none bg-slate-200"
                  value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
                  onChange={(event) =>
                    setBirthDate(parseISO(event.target.value))
                  }
                />

                <label className="ml-2 mb-1" htmlFor="customer-description">
                  Descrição
                </label>
                <textarea
                  className="p-3 min-h-24 mb-3 rounded-lg outline-none bg-slate-200 resize-none"
                  value={description}
                  id="customer-description"
                  maxLength={500}
                  onChange={(event) => setDescription(event.target.value)}
                />

                <div className="flex justify-end gap-x-4">
                  <button
                    type="button"
                    className="mt-5 p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                    onClick={() => (id ? updateCustomer() : createCustomer())}
                  >
                    {id ? "Atualizar" : "Criar"}
                  </button>

                  {id && (
                    <button
                      type="button"
                      className="mt-5 p-2 bg-red-500 text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                      onClick={() => deleteCustomer(id)}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
