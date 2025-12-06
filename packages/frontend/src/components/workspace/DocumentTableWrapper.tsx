"use client";

import { DocumentTable } from "./DocumentTable";
import type { DocumentRequirement } from "@/src/lib/utils/parseCompliance";

type DocumentTableWrapperProps = {
  documents: DocumentRequirement[];
  onStatusChange?: (docId: string, newStatus: DocumentRequirement["status"]) => void;
  countryId?: string;
};

export const DocumentTableWrapper = ({ documents, onStatusChange, countryId }: DocumentTableWrapperProps) => {
  return <DocumentTable documents={documents} onStatusChange={onStatusChange} countryId={countryId} />;
};
