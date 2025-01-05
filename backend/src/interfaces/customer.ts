export default interface Customer {
  id?: string;
  name: string;
  phone: string;
  birthDate?: Date | string | null;
  email?: string | null;
  description?: string | null;
}
