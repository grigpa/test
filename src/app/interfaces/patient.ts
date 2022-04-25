import {IMeta} from "./meta";
import {IText} from "./text";
import {IIdentifier} from "./identifier";
import {IName} from "./name";
import {IEntry} from "./entry";

export interface IPatient {
  resourceType: string;
  id: string;
  meta: IMeta;
  text: IText;
  identifier: Array<IIdentifier>;
  name: Array<IName>;
  displayName: string;
  gender: string;
  birthDate: string;
  appointments: Array<IEntry>;
}
