export default interface Schedule {
  id?: string;
  title: string;
  description: string | null;
  price: number;
  startTime: Date | string;
  endTime: Date | string;
  professionalId: string;
  customerId: string;
}
