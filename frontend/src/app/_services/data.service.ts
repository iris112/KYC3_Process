import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

/** 
 * Implements service for sharing data between components - not used right now
*/
@Injectable()
export class DataService {
    
    private statuses = new BehaviorSubject(null);
    public mrzData = new BehaviorSubject(null);


    currentStatuses = this.statuses.asObservable();
    currentMrzData = new BehaviorSubject(null);

    constructor(private http: HttpClient){}

    setStatuses(statuses: any) {
        this.statuses.next(statuses);
    }

    setMrzData(mrzData: any) {
        this.mrzData.next(mrzData);
    }

}