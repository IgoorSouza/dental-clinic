import { useEffect, useState } from "react";
import PaymentMethod from "../types/payment-method";
import Payment from "../types/payment";
import toast from "react-hot-toast";
import { api } from "../utils/axios";
import { format, formatDate, parseISO } from "date-fns";
import remove from "../assets/remove.svg";

export default function Payments({ scheduleId }: { scheduleId: string }) {
  const [payments, setPayments] = useState<Payment[]>([] as Payment[]);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.PIX
  );
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!scheduleId) return;

    api.get(`/payments?scheduleId=${scheduleId}`).then(({ data }) => {
      setPayments(data);
    });
  }, [scheduleId]);

  function savePayment(): void {
    if (!paymentAmount) {
      toast.error("Por favor, preencha os campos corretamente.");
      return;
    }

    const newPayment: Payment = {
      amount: paymentAmount,
      method: paymentMethod,
      date: paymentDate,
      scheduleId,
    };

    api.post("/payments/new", newPayment).then(({ data }) => {
      const newPayments = [...payments, data];
      setPayments(newPayments);
    });
  }

  function deletePayment(paymentId: string): void {
    api
      .delete(`/payments/delete/${paymentId}`)
      .then(() => {
        const updatedPayments = payments!.filter(
          (payment) => payment.id !== paymentId
        );
        setPayments(updatedPayments);
        toast.success("Pagamento removido com sucesso!");
      })
      .catch(() =>
        toast.error(
          "Ocorreu um erro ao remover o pagamento. Por favor, tente novamente."
        )
      );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Pagamentos</h1>

        <button
          type="button"
          className="mt-3 p-2 bg-black text-white w-28 rounded-lg hover:opacity-80 transition-all duration-400"
          onClick={() =>
            showPaymentForm ? savePayment() : setShowPaymentForm(true)
          }
        >
          {showPaymentForm ? "Salvar" : "Novo"}
        </button>
      </div>

      {!showPaymentForm &&
        (payments?.length === 0 ? (
          <p className="mt-2">Não foi registrado nenhum pagamento.</p>
        ) : (
          <table className="w-full border-collapse self-center mt-2">
            <thead>
              <tr>
                <th className="px-4 py-3 border-slate-300">Quantia</th>
                <th className="px-4 py-3 border-slate-300">
                  Forma de pagamento
                </th>
                <th className="px-4 py-2 border-slate-300">Data</th>
                <th className="px-4 py-2 border-slate-300"></th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => (
                <tr
                  className="hover:bg-slate-200 transition-all duration-400"
                  key={payment.id}
                >
                  <td className="border-t px-4 py-3 border-slate-300 text-center">
                    {payment.amount}
                  </td>
                  <td className="border-t px-4 py-3 border-slate-300 text-center">
                    {payment.method}
                  </td>
                  <td className="border-t px-4 py-2 border-slate-300 text-center">
                    {formatDate(payment.date, "dd/MM/yyyy")}
                  </td>
                  <td
                    className="border-t px-4 py-2 border-slate-300 text-center cursor-pointer"
                    onClick={() => deletePayment(payment.id!)}
                  >
                    <img src={remove} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

      {showPaymentForm && (
        <div className="flex gap-8 mt-3">
          <div className="flex flex-col w-1/3">
            <label className="ml-2 mb-1" htmlFor="payment-amount">
              Quantia<span className="text-red-600">*</span>
            </label>
            <div className="flex items-center p-3 mb-4 rounded-lg bg-slate-200">
              <span>R$</span>
              <input
                type="number"
                id="payment-amount"
                placeholder="Insira a quantia aqui..."
                className="outline-none bg-slate-200 ml-1 w-full"
                min={1}
                value={paymentAmount}
                maxLength={10}
                onChange={(event) =>
                  setPaymentAmount(Number(event.target.value))
                }
              />
            </div>
          </div>

          <div className="flex flex-col w-1/3">
            <label className="ml-2 mb-1" htmlFor="payment-method">
              Forma de pagamento
            </label>
            <select
              id="payment-method"
              className="outline-none bg-slate-200 ml-1 w-full p-3 mb-4 rounded-lg"
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value as PaymentMethod)
              }
            >
              <option value={PaymentMethod.PIX}>PIX</option>
              <option value={PaymentMethod.CASH}>Dinheiro</option>
              <option value={PaymentMethod.CREDIT}>Cartão de Crédito</option>
              <option value={PaymentMethod.DEBIT}>Cartão de Débito</option>
              <option value={PaymentMethod.CHECK}>Cheque</option>
            </select>
          </div>

          <div className="flex flex-col w-1/3">
            <label className="ml-2 mb-1" htmlFor="payment-date">
              Data
            </label>
            <input
              type="date"
              id="payment-date"
              className="p-3 mb-3 rounded-lg outline-none bg-slate-200"
              value={format(paymentDate, "yyyy-MM-dd")}
              onChange={(event) => setPaymentDate(parseISO(event.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
