import { Injectable } from '@angular/core';
import { Log } from '../Models/Log';
import { Observable, of, BehaviorSubject } from '../../../node_modules/rxjs';
import { currentId } from 'async_hooks';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logs: Log[];

  private logSource = new BehaviorSubject<Log>({id: null, text: null, date: null});
  selectedLog = this.logSource.asObservable();

  private stateSource = new BehaviorSubject<boolean> (true);
  stateClear = this.stateSource.asObservable();

  constructor() {
    // this.logs = [
    //   {
    //     id: '1',
    //     text: 'Reticulating Splines...',
    //     date: new Date('04/21/2016')
    //   },
    //   {
    //     id: '2',
    //     text: 'Shaving Llamas.',
    //     date: new Date('04/21/2016')
    //   },
    //   {
    //     id: '3',
    //     text: 'Creating natural disasters',
    //     date: new Date('04/21/2016')
    //   },
    //   {
    //     id: '4',
    //     text: 'Chargin Mah Lazurz',
    //     date: new Date('04/21/2016')
    //   }
    // ];
    this.logs = [];
   }

   getLogs(): Observable<Log[]> {
     if (localStorage.getItem('logs') === null) {
       this.logs = [];
     } else {
       this.logs = JSON.parse(localStorage.getItem('logs'));
     }
     return of(this.logs.sort((a, b) => b.date - a.date));
   }

   setFormLog(log: Log) {
     this.logSource.next(log);
   }

   addLog(log: Log) {
     this.logs.unshift(log);

     // Store this log locally.
     // We need to turn a log array into a string using json.stringify
     localStorage.setItem('logs', JSON.stringify(this.logs));
   }

   updateLog(log: Log) {
     this.logs.forEach((cur, index) => {
       if (log.id === cur.id) {
         this.logs.splice(index, 1);
       }
     });
     this.logs.unshift(log);
     localStorage.setItem('logs', JSON.stringify(this.logs));
   }

   deleteLog(log: Log) {
    this.logs.forEach((cur, index) => {
      if (log.id === cur.id) {
        this.logs.splice(index, 1);
      }
    });
    localStorage.setItem('logs', JSON.stringify(this.logs));
   }

   clearState() {
      this.stateSource.next(true);
   }
}
