export class CreateDocumentDto {
  title: string;
  type: string;
  url: string;
  category: 'Agreement' | 'Milestone';
}
