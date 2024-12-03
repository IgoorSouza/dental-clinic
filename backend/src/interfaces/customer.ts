export default interface Customer {
  id: string;
  name: string;
  phone: string;
  birthDate?: Date | null;
  email?: string | null;
  description?: string | null;
}
