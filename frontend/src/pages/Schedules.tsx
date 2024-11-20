import { useEffect, useState } from "react";
import { api } from "../utils/axios";
import close from "../assets/close.svg";
import toast from "react-hot-toast";
import Schedule from "../types/schedule";
import Professional from "../types/professional";
import Customer from "../types/customer";
import { addHours, format, parseISO, subHours } from "date-fns";
import Payments from "../components/Payments";

export default function Schedules(): JSX.Element {
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [schedules, setSchedules] = useState<Schedule[]>([] as Schedule[]);
  const [id, setId] = useState<string | undefined>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [startTime, setStartTime] = useState<Date>(subHours(new Date(), 3));
  const [endTime, setEndTime] = useState<Date>(subHours(new Date(), 3));
  const [professionals, setProfessionals] = useState<Professional[]>(
    [] as Professional[]
  );
  const [customers, setCustomers] = useState<Customer[]>([] as Customer[]);
  const [selectedProfessional, setSelectedProfessional] = useState<
    Professional | undefined
  >({ name: "" } as Professional);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isProfessionalInputFocused, setIsProfessionalInputFocused] =
    useState<boolean>(false);
  const [isCustomerInputFocused, setIsCustomerInputFocused] =
    useState<boolean>(false);

  const filteredProfessionals = professionals.filter((professional) =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    api
      .get(`/schedules?date=${date}&professionalId=${selectedProfessional?.id}`)
      .then(({ data: schedules }) => {
        setSchedules(schedules);
      });

    api.get("/customers").then(({ data: customers }) => {
      setCustomers(customers);
    });

    api.get("/professionals").then(({ data: professionals }) => {
      setProfessionals(professionals);
      if (!selectedProfessional?.id) setSelectedProfessional(professionals[0]);
    });
  }, [date, selectedProfessional]);

  function createSchedule(): void {
    if (
      isStringEmpty(title) ||
      !price ||
      !startTime ||
      !endTime ||
      !selectedCustomer ||
      !selectedProfessional
    ) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("O horário de fim deve ser maior que o horário de início.");
      return;
    }

    const newSchedule: Schedule = {
      title,
      price,
      startTime: addHours(startTime, 3),
      endTime: addHours(endTime, 3),
      customerId: selectedCustomer.id!,
      professionalId: selectedProfessional.id,
      description,
    };

    api
      .post("/schedules/new", newSchedule)
      .then(({ data }) => {
        setSchedules([...schedules, data]);
        setShowModal(false);
        clear();
        toast.success("Horário criado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao criar horário. Por favor, verifique os dados e tente novamente."
        );
      });
  }

  function updateSchedule(): void {
    if (
      isStringEmpty(title) ||
      !price ||
      !startTime ||
      !endTime ||
      !selectedCustomer ||
      !selectedProfessional
    ) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("O horário de fim deve ser maior que o horário de início.");
      return;
    }

    const newSchedule: Schedule = {
      id,
      title,
      price,
      startTime: addHours(startTime, 3),
      endTime: addHours(endTime, 3),
      customerId: selectedCustomer.id!,
      professionalId: selectedProfessional.id,
      description,
    };

    api
      .put("/schedules/update", newSchedule)
      .then(({ data }) => {
        const updatedScheduleIndex = schedules.findIndex(
          (user) => user.id === id
        );
        const updatedSchedules = [...schedules];
        updatedSchedules[updatedScheduleIndex] = data;
        setSchedules(updatedSchedules);
        setShowModal(false);
        clear();
        toast.success("Horário atualizado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Erro ao criar horário. Por favor, verifique os dados e tente novamente."
        );
      });
  }

  function deleteSchedule(id: string): void {
    api
      .delete(`/schedules/delete/${id}`)
      .then(() => {
        const updatedSchedules = schedules.filter(
          (schedule) => schedule.id !== id
        );
        setSchedules(updatedSchedules);
        setShowModal(false);
        clear();
        toast.success("Horário excluído com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao excluir horário. Por favor, tente novamente.");
      });
  }

  function clear(): void {
    setId(undefined);
    setTitle("");
    setPrice(undefined);
    setStartTime(subHours(new Date(), 3));
    setEndTime(subHours(new Date(), 3));
    setDescription("");
    setSelectedCustomer(undefined);
  }

  function isStringEmpty(string: string): boolean {
    return string.trim() === "";
  }

  return (
    <>
      <h1 className="text-4xl mt-16 mb-8 text-center">Horários</h1>

      <div className="h-screen flex flex-col max-w-[800px] mx-auto">
        <div className="flex justify-between items-center mt-3 mb-5">
          <div className="flex items-center">
            <label htmlFor="date">Data: </label>
            <input
              value={date}
              id="date"
              type="date"
              className="ml-1 max-w-32 border border-slate-600 py-1 px-2"
              onChange={(event) =>
                setDate(format(parseISO(event.target.value), "yyyy-MM-dd"))
              }
            />

            <div className="flex items-center">
              <label htmlFor="professional" className="ml-5 mr-2">
                Profissional:{" "}
              </label>
              <div>
                {/* <input
                  id="professional"
                  type="text"
                  placeholder="Filtrar profissionais..."
                  className="ml-1 border border-slate-600 py-1 px-2"
                  value={selectedProfessional?.name}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={() => setIsProfessionalInputFocused(true)}
                  onBlur={() => {
                    if (!selectedProfessional) setSearchTerm("");
                    setIsProfessionalInputFocused(false);
                  }}
                /> */}
                <input
                  type="text"
                  placeholder="Filtrar profissionais..."
                  className="p-2 mb-1 rounded-lg outline-none bg-slate-200"
                  value={
                    isProfessionalInputFocused
                      ? searchTerm
                      : selectedProfessional?.name
                  }
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={() => setIsProfessionalInputFocused(true)}
                  onBlur={() => {
                    if (!selectedProfessional) setSearchTerm("");
                    setIsProfessionalInputFocused(false);
                  }}
                />
                {isProfessionalInputFocused && (
                  <div className="relative">
                    <div className="absolute left-0 right-0 max-h-24 overflow-y-auto bg-slate-100 rounded-lg shadow-lg">
                      {filteredProfessionals.map((professional) => (
                        <div
                          key={professional.id}
                          className="p-3 border-slate-400 hover:bg-slate-300 cursor-pointer"
                          onMouseDown={() => {
                            const findProfessional = professionals.find(
                              (findProfessional) =>
                                professional.id === findProfessional.id
                            );

                            setSearchTerm("");
                            setSelectedProfessional(findProfessional);
                          }}
                        >
                          {professional.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="ml-auto px-3 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-all duration-400"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Novo Horário
          </button>
        </div>

        <table className="w-full border-collapse self-center">
          <thead>
            <tr>
              <th className="px-4 py-3 border-slate-300">Título</th>
              <th className="px-4 py-2 border-slate-300">Horário</th>
              <th className="px-4 py-2 border-slate-300">Cliente</th>
              <th className="px-4 py-2 border-slate-300">Profissional</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule: Schedule) => (
              <tr
                className="hover:cursor-pointer hover:bg-slate-200 transition-all duration-400"
                key={schedule.id}
                onClick={() => {
                  setId(schedule.id);
                  setTitle(schedule.title);
                  setDescription(schedule.description ?? "");
                  setPrice(schedule.price);
                  setStartTime(
                    new Date(
                      new Date(schedule.startTime).setHours(
                        new Date(schedule.startTime).getHours() - 3
                      )
                    )
                  );
                  setEndTime(
                    new Date(
                      new Date(schedule.endTime).setHours(
                        new Date(schedule.endTime).getHours() - 3
                      )
                    )
                  );
                  setSelectedProfessional(() =>
                    professionals.find(
                      (professional) =>
                        professional.id === schedule.professionalId
                    )
                  );
                  setSelectedCustomer(() =>
                    customers.find(
                      (customer) => customer.id === schedule.customerId
                    )
                  );
                  setShowModal(true);
                }}
              >
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {schedule.title}
                </td>
                <td className="border-t px-4 py-3 border-slate-300 text-center">
                  {format(parseISO(schedule.startTime.toString()), "HH:mm")} -{" "}
                  {format(parseISO(schedule.endTime.toString()), "HH:mm")}
                </td>
                <td className="border-t px-4 py-2 border-slate-300 text-center">
                  {
                    customers.find(
                      (customer) => customer.id === schedule.customerId
                    )?.name
                  }
                </td>
                <td className="border-t px-4 py-2 border-slate-300 text-center">
                  {
                    professionals.find(
                      (professional) =>
                        professional.id === schedule.professionalId
                    )?.name
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-[900px] max-h-[700px] overflow-y-auto">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4">Detalhes do Horário</h2>
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
                <div className="flex gap-8">
                  <div className="flex flex-col w-1/2">
                    <label className="ml-2 mb-1" htmlFor="schedule-title">
                      Título<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="schedule-title"
                      placeholder="Insira o título aqui..."
                      className="p-3 mb-4 rounded-lg outline-none bg-slate-200"
                      value={title}
                      maxLength={50}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="ml-2 mb-1" htmlFor="schedule-price">
                      Preço<span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center p-3 mb-4 rounded-lg bg-slate-200">
                      <span>R$</span>
                      <input
                        type="number"
                        id="schedule-price"
                        placeholder="Insira o preço aqui..."
                        className="outline-none bg-slate-200 ml-1 w-full"
                        min={0}
                        value={price}
                        maxLength={15}
                        onChange={(event) =>
                          setPrice(Number(event.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="flex flex-col w-1/2">
                    <label className="ml-2 mb-1" htmlFor="schedule-start-time">
                      Horário de início<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="schedule-start-time"
                      placeholder="Insira o horário de início aqui..."
                      className="p-3 mb-4 w-full rounded-lg outline-none bg-slate-200"
                      value={
                        startTime ? startTime.toISOString().slice(0, 16) : ""
                      }
                      onChange={(event) =>
                        setStartTime(subHours(parseISO(event.target.value), 3))
                      }
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="ml-2 mb-1" htmlFor="schedule-end-time">
                      Horário de fim<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="schedule-end-time"
                      placeholder="Insira o horário de fim aqui..."
                      className="p-3 mb-3 rounded-lg outline-none bg-slate-200"
                      value={endTime ? endTime.toISOString().slice(0, 16) : ""}
                      onChange={(event) =>
                        setEndTime(subHours(parseISO(event.target.value), 3))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="flex flex-col w-1/2">
                    <label className="ml-2 mb-1">
                      Cliente<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Filtrar clientes..."
                      className="p-3 mb-1 rounded-lg outline-none bg-slate-200"
                      value={
                        isCustomerInputFocused
                          ? searchTerm
                          : selectedCustomer?.name
                      }
                      onChange={(event) => setSearchTerm(event.target.value)}
                      onFocus={() => setIsCustomerInputFocused(true)}
                      onBlur={() => {
                        if (!selectedCustomer) setSearchTerm("");
                        setIsCustomerInputFocused(false);
                      }}
                    />
                    {isCustomerInputFocused && (
                      <div className="relative">
                        <div className="absolute left-0 right-0 max-h-36 overflow-y-auto bg-slate-100 rounded-lg shadow-lg">
                          {filteredCustomers.map((customer) => (
                            <div
                              key={customer.id}
                              className="p-3 border-slate-400 hover:bg-slate-300 cursor-pointer"
                              onMouseDown={() => {
                                const findCustomer = customers.find(
                                  (findCustomer) =>
                                    customer.id === findCustomer.id
                                );

                                setSelectedCustomer(findCustomer);
                              }}
                            >
                              {customer.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="ml-2 mb-1">
                      Profissional<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Filtrar profissionais..."
                      className="p-3 mb-1 rounded-lg outline-none bg-slate-200"
                      value={
                        isProfessionalInputFocused
                          ? searchTerm
                          : selectedProfessional?.name
                      }
                      onChange={(event) => setSearchTerm(event.target.value)}
                      onFocus={() => setIsProfessionalInputFocused(true)}
                      onBlur={() => {
                        if (!selectedProfessional) setSearchTerm("");
                        setIsProfessionalInputFocused(false);
                      }}
                    />
                    {isProfessionalInputFocused && (
                      <div className="relative">
                        <div className="absolute left-0 right-0 max-h-36 overflow-y-auto bg-slate-100 rounded-lg shadow-lg">
                          {filteredProfessionals.map((professional) => (
                            <div
                              key={professional.id}
                              className="p-3 border-slate-400 hover:bg-slate-300 cursor-pointer"
                              onMouseDown={() => {
                                const findProfessional = professionals.find(
                                  (findProfessional) =>
                                    professional.id === findProfessional.id
                                );

                                setSearchTerm("");
                                setSelectedProfessional(findProfessional);
                              }}
                            >
                              {professional.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <label className="ml-2 mb-1 mt-2">Descrição</label>
                <textarea
                  className="p-3 min-h-24 mb-3 rounded-lg outline-none bg-slate-200 resize-none"
                  value={description}
                  maxLength={500}
                  onChange={(event) => setDescription(event.target.value)}
                />

                {id && <Payments scheduleId={id} />}

                <div className="flex justify-end gap-x-4">
                  <button
                    type="button"
                    className="mt-5 p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                    onClick={() => (id ? updateSchedule() : createSchedule())}
                  >
                    {id ? "Atualizar" : "Criar"}
                  </button>

                  {id && (
                    <button
                      type="button"
                      className="mt-5 p-2 bg-red-500 text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
                      onClick={() => deleteSchedule(id)}
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