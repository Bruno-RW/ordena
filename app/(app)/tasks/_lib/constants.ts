import { StatusEnum } from "@/types/task";

export const STATUS_LABELS: Record<StatusEnum, string> = {
    pending: "Pendente",
    in_progress: "Em andamento",
    completed: "Concluída",
};

export const STATUS_VARIANTS: Record<StatusEnum, "default" | "secondary" | "outline" | "destructive"> = {
    completed: "default",
    in_progress: "secondary",
    pending: "outline",
};

export function statusLabel(status: "all" | StatusEnum) {
    if (status === "all") return "Todos os status";
    return STATUS_LABELS[status];
}
