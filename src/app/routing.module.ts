import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SandboxWebappComponent } from './sandbox-webapp/sandbox-webapp.component';
import {MediaViewerModule} from '../../projects/media-viewer/src/lib/media-viewer.module';

const routes: Routes = [{
    path: '',
    component: SandboxWebappComponent
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled'
        }),
        HttpClientModule,
        ReactiveFormsModule,
        MediaViewerModule
    ],
    declarations: [
        SandboxWebappComponent
    ],
    providers: [
    ],
    exports: [
        RouterModule
    ]
})

export class RoutingModule {
}
