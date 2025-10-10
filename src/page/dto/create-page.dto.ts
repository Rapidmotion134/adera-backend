export class CreatePageDto {
  title: string;
  description: string;
  image: string;
  url: string;
  category: 'Service Request' | 'Appointment Request' | 'Support Request';
}
