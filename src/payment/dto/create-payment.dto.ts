export class CreatePaymentDto {
  title: string;
  stripeAmount: number;
  bankName: string;
  bankAccount: string;
  accountName: string;
  amount: number;
  userId: number;
}
