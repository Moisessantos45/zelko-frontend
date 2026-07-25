import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import axios from "axios";
import { useApiResult } from "@/composables/useApiResult";
import { initialPaginationState, type Pagination } from "@/entities/pagination";
import {
  initialDocumentResponse,
  type DocumentListItem,
  type DocumentResponse,
} from "@/entities/document";
import { apiAuth } from "@/services/api";
import {
  mapperDocumentListItem,
  mapperDocumentResponse,
} from "@/helpers/mappers/document";
import { mapperPagination } from "@/helpers/mappers/paginated";
import type { BaseEntity } from "@/entities/generic";
import { mapperStateGeneric } from "@/helpers/mappers/state";

export interface CompileResult {
  ok: boolean;
  pdfUrl?: string;
  log?: string;
  error?: string;
  [key: string]: unknown;
}

export const useDocumentStore = defineStore("document", () => {
  const source = ref<string>(`\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{Mi Documento}
\\author{Usuario}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
Este es el resumen del documento. Aquí puedes describir
brevemente el contenido principal de tu trabajo.
\\end{abstract}

\\section{Introducción}
Escribe aquí la introducción de tu documento. Puedes usar
\\textbf{negrita}, \\textit{cursiva} y mucho más.

\\section{Metodología}
\\subsection{Primer Apartado}
El contenido de tu sección va aquí. Incluye ecuaciones:

\\begin{equation}
  E = mc^2
\\end{equation}

\\subsection{Segundo Apartado}
\\begin{itemize}
  \\item Primer elemento
  \\item Segundo elemento
  \\item Tercer elemento
\\end{itemize}

\\section{Resultados}
Los resultados de tu investigación van aquí.

\\section{Conclusiones}
Escribe tus conclusiones finales.

\\end{document}`);

  const { exec, loading } = useApiResult();
  const paginated = reactive<Pagination>(
    structuredClone(initialPaginationState),
  );
  const visibilityList = ref<BaseEntity[]>([]);
  const documentList = ref<DocumentListItem[]>([]);
  const documentDetails = reactive<DocumentResponse>(
    structuredClone(initialDocumentResponse),
  );

  const documentForm = reactive<DocumentResponse>(
    structuredClone(initialDocumentResponse),
  );

  const pdfUrl = ref<string>("");
  const errorLog = ref<string>("");
  const compiledOk = ref<boolean>(true);
  const isCompiling = ref<boolean>(false);

  const setSource = (newSource: string) => {
    source.value = newSource;
  };

  const visibilityDropdownOptions = computed(() => {
    return [
      {
        id: 0,
        label: "Todos",
      },
      ...visibilityList.value.map((item) => ({
        id: item.id,
        label: item.name,
      })),
    ];
  });

  const getVisibilityList = async () => {
    return await exec(() => apiAuth.get("/documents/visibilities"), {
      mapper(res) {
        const extractedData = res.data.data ?? [];
        return extractedData.map(mapperStateGeneric);
      },
      onSuccess: (data) => {
        visibilityList.value = data;
      },
      onError: (_) => {},
    });
  };

  const getDocumentList = async () => {
    return await exec(
      () =>
        apiAuth.get("/documents", {
          params: {
            page: paginated.page,
            pageSize: paginated.pageSize,
          },
        }),
      {
        mapper(res) {
          const extractedData = res.data.data.data ?? [];

          return {
            data: extractedData.map(mapperDocumentListItem),
            pagination: mapperPagination(res.data.data.paginate),
          };
        },
        onSuccess: (data) => {
          documentList.value = data.data;
          Object.assign(paginated, data.pagination);
        },
        onError: (_) => {},
      },
    );
  };

  const getDocumentDetails = async (slug: string) => {
    return await exec(() => apiAuth.get(`/documents/${slug}`), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error("No se encontraron datos del documento.");
        }

        return mapperDocumentResponse(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(documentDetails, data);
        if (data.content) {
          source.value = data.content;
        }
      },
      onError: (_) => {},
    });
  };

  const createDocument = async (title: string, content: string) => {
    return await exec(
      () =>
        apiAuth.post("/documents", {
          title: title,
          content: content,
        }),
      {
        mapper(res) {
          const extractedData = res.data.data ?? null;
          if (!extractedData) {
            throw new Error("No se encontraron datos del documento.");
          }

          return mapperDocumentListItem(extractedData);
        },
        onSuccess: (data) => {
          documentList.value.push(data);
          Object.assign(documentForm, data);
        },
        onError: (_) => {},
      },
    );
  };

  const updateDocument = async (
    slug: string,
    title: string,
    content: string,
  ) => {
    return await exec(
      () =>
        apiAuth.put(`/documents/${slug}`, {
          title: title,
          content: content,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? null;
          if (!extractedData) {
            throw new Error("No se encontraron datos del documento.");
          }

          return extractedData;
        },
        onSuccess: (_) => {
          getDocumentDetails(slug);
        },
        onError: (_) => {},
      },
    );
  };

  const updateDocumentVisibility = async (
    slug: string,
    newVisibility: number,
  ) => {
    return await exec(
      () =>
        apiAuth.patch(`/documents/${slug}/visibility`, {
          visibility_id: newVisibility,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? null;
          if (!extractedData) {
            throw new Error("No se encontraron datos del documento.");
          }

          return extractedData;
        },
        onSuccess: (_) => {
          getDocumentList();
        },
        onError: (_) => {},
      },
    );
  };

  const previewDocument = async (
    slugParam?: string,
  ): Promise<string | null> => {
    const targetSlug = slugParam || documentDetails.slug;
    if (!targetSlug) return null;

    try {
      const res = await apiAuth.get(`/documents/${targetSlug}/preview`, {
        responseType: "blob",
      });

      const contentType = String(res.headers["content-type"] || res.headers["Content-Type"] || (res.data as Blob)?.type || "");
      if (contentType.includes("application/json")) {
        const text = await (res.data as Blob).text();
        const json = JSON.parse(text);
        const url = json.pdfUrl || json.data?.pdfUrl || json.url;
        if (url) {
          pdfUrl.value = url;
          compiledOk.value = true;
          return url;
        }
      } else {
        if (pdfUrl.value && pdfUrl.value.startsWith("blob:")) {
          URL.revokeObjectURL(pdfUrl.value);
        }
        const blob = new Blob([res.data], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        pdfUrl.value = blobUrl;
        compiledOk.value = true;
        return blobUrl;
      }
    } catch (err: unknown) {
      console.error("Error al obtener la vista previa del documento:", err);
    }
    return null;
  };

  const compileLatex = async (
    sourceText?: string,
    slugParam?: string,
  ): Promise<CompileResult> => {
    if (isCompiling.value) {
      return {
        ok: false,
        error: "Ya hay una compilación en proceso.",
        log: "Ya hay una compilación en proceso.",
      };
    }

    const textToCompile = sourceText !== undefined ? sourceText : source.value;
    source.value = textToCompile;
    isCompiling.value = true;
    errorLog.value = "";

    const targetSlug = slugParam || documentDetails.slug;

    if (!targetSlug) {
      isCompiling.value = false;
      compiledOk.value = false;
      errorLog.value =
        "No se ha especificado el identificador (slug) del documento.";
      return { ok: false, error: errorLog.value, log: errorLog.value };
    }

    try {
      if (textToCompile !== documentDetails.content) {
        try {
          await apiAuth.put(
            `/documents/${targetSlug}`,
            {
              title: documentDetails.title || "Sin título",
              content: textToCompile,
            },
            {
              headers: {
                "X-Idempotency-Key": crypto.randomUUID(),
              },
            },
          );
          documentDetails.content = textToCompile;
        } catch (saveErr) {
          console.warn(
            "No se pudo guardar el documento antes de compilar:",
            saveErr,
          );
        }
      }

      const res = await apiAuth.post(
        `/documents/${targetSlug}/compile`,
        {},
        {
          headers: {
            "X-Idempotency-Key": crypto.randomUUID(),
          },
        },
      );

      const resData = res.data;
      const data = resData?.data ?? resData;

      const ok = data?.ok ?? resData?.ok ?? true;
      const log = data?.log || data?.error || resData?.message || "";

      if (ok) {
        const loadedBlobUrl = await previewDocument(targetSlug);
        if (!loadedBlobUrl) {
          compiledOk.value = false;
          errorLog.value = "No se pudo obtener la vista previa en PDF.";
          return { ok: false, error: errorLog.value, log: errorLog.value };
        }

        compiledOk.value = true;
        errorLog.value = "";
        return {
          ok: true,
          pdfUrl: pdfUrl.value,
          log: data?.log || "",
        };
      } else {
        const logMsg = log || "Error al compilar el documento.";
        compiledOk.value = false;
        errorLog.value = logMsg;
        return { ok: false, log: logMsg, error: logMsg };
      }
    } catch (err: unknown) {
      let errorMessage = "Error de red al conectar con el servidor.";
      if (axios.isAxiosError(err)) {
        const respData = err.response?.data;
        errorMessage =
          respData?.log ||
          respData?.error ||
          respData?.message ||
          err.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      compiledOk.value = false;
      errorLog.value = errorMessage;
      return { ok: false, error: errorMessage, log: errorMessage };
    } finally {
      isCompiling.value = false;
    }
  };

  return {
    documentLoading: loading,
    source,
    pdfUrl,
    errorLog,
    compiledOk,
    isCompiling,
    documentList,
    documentDetails,
    paginated,
    documentForm,
    setSource,
    visibilityList,
    visibilityDropdownOptions,
    getVisibilityList,
    getDocumentList,
    getDocumentDetails,
    createDocument,
    updateDocument,
    updateDocumentVisibility,
    previewDocument,
    compileLatex,
  };
});

export default useDocumentStore;
