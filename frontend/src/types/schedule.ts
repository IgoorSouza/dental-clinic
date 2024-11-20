export default interface Schedule {
  id?: string;
  title: string;
  description?: string;
  price: number;
  startTime: Date;
  endTime: Date;
  professionalId: string;
  customerId: string;
}
