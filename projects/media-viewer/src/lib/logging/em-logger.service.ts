import { Injectable } from '@angular/core';

@Injectable()
export class EmLoggerService {

    error(message) {
        this.log('error-', JSON.stringify(message));
    }

    info(message) {
        this.log('info-', JSON.stringify(message));
    }

    log(level: string, message: any) {
        console.trace(level, message);
    }
}
