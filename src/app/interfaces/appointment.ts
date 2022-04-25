import {IMeta} from "./meta";
import {IEntry} from "./entry";

export interface IAppointment {
  resourceType: string;
  id: string;
  meta: IMeta;
  type: string;
  link: Array<{ [prop: string]: string }>;
  entry: Array<IEntry>;
}
