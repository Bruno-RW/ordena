export enum EventEnum {
  TASK = "task",
  TEST = "test",
  EVENT = "event"
}

export type Event = {
  id: string;
  title: string;
  date: string;
  type: EventEnum;
  subjectId?: string;
};
