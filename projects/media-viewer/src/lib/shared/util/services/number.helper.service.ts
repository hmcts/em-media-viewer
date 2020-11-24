import { Injectable } from '@angular/core';

/**
 * Number Helper Service
 * */
@Injectable({
    providedIn: 'root'
})

export class NumberHelperService {
    constructor() { }

    public isNumber(value: string | number): boolean {
        return (
            value !== null
            && value !== undefined
            && value !== ''
            && !isNaN(Number(value.toString()))
        );
    }
  }
