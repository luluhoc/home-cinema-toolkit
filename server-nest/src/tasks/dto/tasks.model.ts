export class Time {
  hour: number;
  minute: number;
  dayOfWeek: null | number;
}
export interface ITasks {
  time: Time;
  jobType: string;
  variable: string;
  on: boolean;
  exTime?: number;
  deleted?: number;
  lastEx?: string;
}
