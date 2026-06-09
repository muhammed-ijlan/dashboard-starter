import type { DAppEntry, CreateDappsPayload } from "@/api/dapps";

export type DAppCategory = "DeFi" | "NFT" | "GameFi" | "DEX" | "Lending";
export type DAppStatus = "active" | "inactive";

export interface DAppDrawerProps {
  open: boolean;
  editingEntry: DAppEntry | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateDappsPayload & { id?: number }) => void;
}

export interface DAppFormValues {
  name: string;
  icon?: string;
  description?: string;
  url: string;
  typeId: number;
  isActive: boolean;
}
