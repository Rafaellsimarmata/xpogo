const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

const normalizeUrl = (url: string) => {
  if (!url) {
    return "";
  }
  return url.endsWith("/") ? url : `${url}/`;
};

export const BACKEND_URL = normalizeUrl(rawBackendUrl);

if (typeof window !== "undefined" && !BACKEND_URL) {
  console.warn("NEXT_PUBLIC_BACKEND_URL is not configured.");
}
