type DocumentType = 'latex' | 'typst';

interface DocumentListItem {
  id: number;
  slug: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  visibilityId: number;
  typeDocument: string;
}

interface DocumentResponse {
  id: number;
  slug: string;
  title: string;
  content: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  visibilityId?: number;
  typeDocument: string;
}

const initialDocumentResponse = {
  id: 0,
  slug: "",
  title: "",
  content: "",
  url: "",
  createdAt: "",
  updatedAt: "",
  visibilityId: undefined,
  typeDocument: "latex"
}

export type { DocumentListItem, DocumentResponse, DocumentType };
export { initialDocumentResponse };
