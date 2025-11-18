import {Component, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: false
})

export class AppComponent {
    title = 'Media Viewer Demo App';

    constructor() {}
}
