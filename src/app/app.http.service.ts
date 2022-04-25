import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IAppointment} from "./interfaces/appointment";
import {HttpClient} from "@angular/common/http";
import {IPatient} from "./interfaces/patient";

@Injectable()
export class AppHttpService {
  readonly appoitmentUrl: string = 'https://hapi.fhir.org/baseR4/Appointment';
  readonly patientUrl: string = 'http://hapi.fhir.org/baseR4/Patient';

  constructor(private http: HttpClient) {
  }

  getAppoitment(size: number): Observable<IAppointment> {
    return this.http.get<IAppointment>(this.appoitmentUrl, {params: {_count: size}});
  }

  getPatient(id: string): Observable<IPatient> {
    return this.http.get<IPatient>(`${this.patientUrl}/${id}`);
  }
}
