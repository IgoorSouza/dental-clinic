type Schedule = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  startTime: Date;
  endTime: Date;
  professionalId: string;
  customerId: string;
};

export default Schedule;
