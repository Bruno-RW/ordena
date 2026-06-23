import { StatusEnum } from "@/types/task";

export const STATUS_LABELS: Record<StatusEnum, string> = {
    completed: "Pendente",
    in_progress: "Em andamento",
    pending: "Concluída",
};

export const STATUS_VARIANTS: Record<StatusEnum, "default" | "secondary" | "outline" | "destructive"> = {
    completed: "default",
    in_progress: "secondary",
    pending: "outline",
};