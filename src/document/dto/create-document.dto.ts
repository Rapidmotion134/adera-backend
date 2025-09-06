export class CreateDocumentDto {
  title: string;
  type: string;
  issueDate: Date;
  expireDate: Date;
  url: string;
  orderId: number;
  requestId: number;
  userId: number;
}
