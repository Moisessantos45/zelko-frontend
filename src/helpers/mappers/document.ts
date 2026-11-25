import type { DocumentListItem, DocumentResponse } from "@/entities/document";
import { getDateToString, getNumber, getString } from "./formatters";

const mapperDocumentListItem = (
  data: Record<string, unknown>,
): DocumentListItem => {
  return {
    id: getNumber(data.id),
    slug: getString(data.slug),
    title: getString(data.title),
    url: getString(data.url),
    visibilityId: getNumber(data.visibility_id),
    typeDocument: getString(data.type_document) || getString(data.typeDocument) || "latex",
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
  };
};

const mapperDocumentResponse = (
  data: Record<string, unknown>,
): DocumentResponse => {
  return {
    id: getNumber(data.id),
    slug: getString(data.slug),
    title: getString(data.title),
    content: getString(data.content),
    url: getString(data.url),
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
    visibilityId: getNumber(data.visibility_id),
    typeDocument: getString(data.type_document) || getString(data.typeDocument) || "latex",
  };
};

export { mapperDocumentListItem, mapperDocumentResponse };
