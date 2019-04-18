import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './auth/auth-guard.service';
import { RedirectionService } from './auth/redirection.service';
import { SandboxWebappComponent } from './sandbox-webapp/sandbox-webapp.component';
import { MediaViewerModule } from '@hmcts/media-viewer';

const routes: Routes = [{
    path: '',
    component: SandboxWebappComponent,
    canActivate: [AuthGuardService]
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
        RedirectionService
    ],
    exports: [
        RouterModule
    ]
})

export class RoutingModule {
}
