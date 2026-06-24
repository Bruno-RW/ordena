import { Score } from "@/types/score";

export function subjectAverage(scores: Score[]): number | null {
    if (scores.length === 0) return null;

    const totalWeight = scores.reduce((a, n) => a + n.weight, 0);
    const sum = scores.reduce((a, n) => a + n.value * n.weight, 0);

    return totalWeight > 0 ? sum / totalWeight : null;
}

export function mediaColor(m: number | null): string {
    if (m === null) return "text-muted-foreground";
    if (m >= 7) return "text-emerald-600 dark:text-emerald-400";
    if (m >= 5) return "text-amber-600 dark:text-amber-400";
    return "text-destructive";
}