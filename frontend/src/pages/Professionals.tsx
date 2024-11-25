import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../utils/axios";
import Professional from "../types/professional";
import close from "../assets/close.svg";
import Inputmask from "inputmask";
import { useClickAway } from "react-use";
import loadingIcon from "../assets/loading.svg";

export default function Professionals(): JSX.Element {
  const [professionals, setProfessionals] = useState<Professional[]>(
    [] as Professional[]
  );
  const [id, setId] = useState<string | undefined>();
  const [name, setName] = useState<string>("");
  const [crm, setCrm] = useState<string>("");
  const [phone, setPhone] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const professionalPhone = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get("/professionals").then(({ data: professionals }) => {
      setProfessionals(professionals);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const mask = new Inputmask("(99) 99999-9999");
    const professionalPhoneRef = professionalPhone.current;
    if (professionalPhoneRef) mask.mask(professionalPhoneRef);
  }, [showModal]);

  useClickAway(modalRef, () => setShowModal(false));

  function createProfessional(): void {
    if (
      isStringEmpty(name) ||
      isStringEmpty(crm) ||
      (phone && !isStringEmpty(phone) && phone.includes("_"))
    ) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    setLoading(true);

    const newProfessional = {
      name,
      crm,
      phone,
      email,
    };

    api
      .post("/professionals/new", newProfessional)
      .then(({ data }) => {
        setShowModal(false);
        setProfessionals([...professionals, data]);
        clear();
        toast.success("Profissional criado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao criar profissional. Por favor, verifique os dados e tente novamente."
        );
      })
      .finally(() => setLoading(false));
  }

  function updateProfessional(): void {
    console.log(phone, !isStringEmpty(phone!), !phone?.includes("_"));
    if (
      isStringEmpty(name) ||
      isStringEmpty(crm) ||
      (phone && !isStringEmpty(phone) && phone.includes("_"))
    ) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    setLoading(true);

    const newProfessional = {
      id,
      name,
      crm,
      phone,
      email,
    };

    api
      .put("/professionals/update", newProfessional)
      .then(({ data }) => {
        const updatedProfessionalIndex = professionals.findIndex(
          (professional) => professional.id === id
        );
        const updatedProfessionals = [...professionals];
        updatedProfessionals[updatedProfessionalIndex] = data;
        setProfessionals(updatedProfessionals);
        setShowModal(false);
        clear();
        toast.success("Profissional atualizado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao atualizar profissional. Por favor, verifique os dados e tente novamente."
        );
      })
      .finally(() => setLoading(false));
  }

  function deleteProfessional(professionalId: string): void {
    setLoading(true);

    api
      .delete(`/professionals/delete/${professionalId}`)
      .then(() => {
        const updatedProfessionals = professionals.filter(
          (professional) => professional.id !== professionalId
        );
        setProfessionals(updatedProfessionals);
        setShowModal(false);
        clear();
        toast.success("Profissional excluído com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao excluir profissional. Por favor, tente novamente mais tarde."
        );
      })
      .finally(() => setLoading(false));
  }

  function clear(): void {
    setId(undefined);
    setName("");
    setCrm("");
    setPhone("");
    setEmail(undefined);
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
      <h1 className="text-4xl mt-16 mb-8 text-center">Profissionais</h1>

      <div className="h-screen flex flex-col max-w-[800px] mx-auto">
        <button
          type="button"
          className="mt-3 mb-5 ml-auto px-3 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-all duration-400"
          onClick={() => setShowModal(true)}
        >
          Novo profissional
        </button>

        <table className="w-full border-collapse self-center">
          <thead>
            <tr>
              <th className="px-4 py-3 border-slate-300">Nome</th>
              <th className="px-4 py-3 border-slate-300">CRM</th>
              <th className="px-4 py-3 border-slate-300">Telefone</th>
              <th className="px-4 py-2 border-slate-300">Email</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((professional: Professional) => (
              <tr
                className="hover:cursor-pointer hover:bg-slate-200 transition-all duration-400"
                key={professional.id}
                onClick={() => {
                  setId(professional.id);
                  setName(professional.name);
                  setCrm(professional.crm);
                  setPhone(professional.phone);
                  setEmail(professional.email);
                  setShowModal(true);
                }}
              >
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {professional.name}
                </td>
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {professional.crm}
                </td>
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {professional.phone}
                </td>
                <td className="border-t px-4 py-2 border-slate-300 text-center">
                  {professional.email}
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
              <h2 className="text-2xl font-bold mb-4">
                Detalhes do Profissional
              </h2>
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
                <label className="ml-2 mb-1" htmlFor="professional-name">
                  Nome<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="professional-name"
                  placeholder="Insira o nome aqui..."
                  className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                  value={name}
                  maxLength={50}
                  onChange={(event) => setName(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="professional-crm">
                  CRM<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="professional-crm"
                  placeholder="Insira o CRM aqui..."
                  className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                  value={crm}
                  maxLength={50}
                  onChange={(event) => setCrm(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="professional-phone">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="professional-phone"
                  ref={professionalPhone}
                  placeholder="Insira o telefone aqui..."
                  className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />

                <label className="ml-2 mb-1" htmlFor="professional-email">
                  Email
                </label>
                <input
                  type="email"
                  id="professional-email"
                  placeholder="Insira a senha aqui..."
                  value={email}
                  className="p-3 w-full rounded-l-lg outline-none bg-slate-200"
                  maxLength={50}
                  onChange={(event) => setEmail(event.target.value)}
                />

                {id ? (
                  <div className="flex justify-end gap-x-4">
                    <button
                      type="button"
                      className="mt-5 p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                      onClick={updateProfessional}
                    >
                      Atualizar
                    </button>

                    <button
                      type="button"
                      className="mt-5 p-2 bg-red-500 text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                      onClick={() => deleteProfessional(id!)}
                    >
                      Excluir
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-x-4">
                    <button
                      type="button"
                      className="mt-5 p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                      onClick={createProfessional}
                    >
                      Criar
                    </button>
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
