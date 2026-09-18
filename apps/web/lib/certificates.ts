/** Mirrors the `certificates` table in the API (apps/api/src/db/schema.ts). */
export type Certificate = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  updatedAt: string;
  isVisible: boolean;
};
