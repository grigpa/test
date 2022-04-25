import {IEntryResource} from "./entryResource";

export interface IEntry {
  fullUrl: string;
  patientId?: any;
  resource: IEntryResource;
}
