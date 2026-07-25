interface DocumentListItem {
  id: number;
  slug: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  visibilityId: number;
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
}

const initialDocumentResponse={
  id: 0,
  slug: "",
  title: "",
  content: "",
  url: "",
  createdAt: "",
  updatedAt: "",
  visibilityId: undefined,
}

export type { DocumentListItem, DocumentResponse };
export { initialDocumentResponse };