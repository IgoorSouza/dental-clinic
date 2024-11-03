type Schedule = {
  id: string;
  title: string;
  description: string;
  price: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  professionalId: string;
  customerId: string;
};

export default Schedule;
