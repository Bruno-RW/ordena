export enum StatusEnum {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}

export type Task = {
  id: string;
  title: string;
  subjectId: string;
  deadline: string;
  status: StatusEnum;
  description?: string;
  score?: number;
  weight?: number;
};
