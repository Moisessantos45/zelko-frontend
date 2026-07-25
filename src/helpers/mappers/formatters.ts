const getString = (value: unknown, fallback: string = ""): string =>
  typeof value === "string" ? value : fallback;

const getNumber = (value: unknown, fallback: number = 0): number => {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

const formatDate = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const date = new Date(value);
  return date.toISOString().split("T")[0] ?? "";
};

const getDateToString = (value: unknown): string => {
  const str = getString(value);
  if (!str) return "";

  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0] ?? "";
};

function getTimeToString(value: unknown): string {
  const raw = getString(value);
  if (!raw) return "";
  const match = raw.match(/(\d{2}:\d{2}):\d{2}/);
  return match ? match[1] : "";
}

const getBoolean = (value: unknown): boolean =>
  typeof value === "boolean" ? value : value === "true";

const getStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

const getOptionalNumber = (value: unknown): number | undefined =>
  typeof value === "number" && !Number.isNaN(value) ? value : undefined;

const getDateToHour = (
  value: unknown,
  timeZone = "America/Mexico_City",
): string => {
  const timestamp = getString(value);
  if (!timestamp) return "";

  const fecha = new Date(timestamp);
  if (Number.isNaN(fecha.getTime())) return "";

  const fmt = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  });

  const parts = fmt.formatToParts(fecha);
  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "00";
  const secondPart = parts.find((p) => p.type === "second")?.value ?? "00";

  const hh = hourPart.padStart(2, "0");
  const mm = minutePart.padStart(2, "0");
  const ss = secondPart.padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

export {
  getString,
  getNumber,
  formatDate,
  getDateToString,
  getTimeToString,
  getBoolean,
  getStringArray,
  getOptionalNumber,
  getDateToHour,
};
