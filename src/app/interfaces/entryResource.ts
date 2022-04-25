import {IMeta} from "./meta";
import {IText} from "./text";
import {IParticipant} from "./participant";

export interface IEntryResource {
  resourceType: string;
  id: string;
  meta: IMeta;
  text: IText;
  status: string;
  description: string;
  start: string;
  end: string;
  minutesDuration: number;
  participant: Array<IParticipant>;
  search: {mode: string};
}
