/**
 * Turns a stored file path (e.g. "/api/files/certificates/abc.png") into an
 * absolute URL against the API origin. Full URLs pass through unchanged.
 */
export function getFileUrl(fileUrl: string) {
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  if (!fileUrl.startsWith("/api/files/")) return fileUrl;
  return (
    (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787") +
    fileUrl
  );
}
