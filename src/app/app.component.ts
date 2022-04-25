import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppHttpService} from "./app.http.service";
import {
  BehaviorSubject,
  concatMap,
  distinctUntilChanged,
  filter,
  from,
  map, Observable,
  pluck, Subject,
  switchMap, takeUntil,
  toArray,
  zip
} from "rxjs";
import {IEntry} from "./interfaces/entry";
import {IPatient} from "./interfaces/patient";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppHttpService]
})
export class AppComponent implements OnInit, OnDestroy {
  readonly size = 10;
  item$: Observable<IEntry[]>;
  patients$: Observable<IPatient[]>;
  results$: BehaviorSubject<IPatient[]> = new BehaviorSubject<IPatient[]>([]);
  loader$ = new BehaviorSubject<boolean>(true);
  notifier = new Subject<boolean>();

  constructor(private httpService: AppHttpService) {
    this.item$ = this.httpService.getAppoitment(this.size)
      .pipe(
        takeUntil(this.notifier),
        pluck('entry'),
        switchMap((entries) => from(entries)),
        map((item) => {
          const arr = item.resource.participant?.map((participant) => {
            const reference = participant.actor?.reference || '';
            if (reference.startsWith('Patient')) {
              return reference.substr(reference.indexOf('/') + 1);
            }
            return null;
          }).filter(el => el != null);
          item.patientId = arr ? arr[0] : undefined;
          return item;
        }),
        filter(item => item.patientId != undefined),
        toArray()
      );

    this.patients$ = this.item$.pipe(
      takeUntil(this.notifier),
      switchMap((entries) => from(entries)),
      map(item => item.patientId),
      distinctUntilChanged(),
      concatMap(patientId => this.httpService.getPatient(String(patientId))),
      toArray()
    )
  }

  ngOnInit(): void {
    this.getAppoitments();
  }

  ngOnDestroy(): void {
    this.notifier.next(true);
    this.notifier.complete();
  }

  getAppoitments() {

    zip(this.item$, this.patients$).subscribe(res => {
      const items = res[0];
      const patients = res[1];
      patients.map(patient => {
        patient.appointments = items.filter(e => e.patientId === patient.id);
        patient.displayName = (patient.name && patient.name[0]) ? (
          patient.name[0].text ? patient.name[0].text : `${patient.name[0].family} ${patient.name[0].given}`
        ) : 'Name not found';
        return patient;
      });
      this.loader$.next(false);
      this.results$.next(patients);
    });
  }


}
