# Release Notes

## Dependency Hygiene - em-media-viewer

### Summary
Reviewed project dependencies, removed unused packages, and aligned dependency placement to reduce maintenance overhead while preserving runtime and test behavior.

### Changes
1. Removed unused production dependencies:
- @angular-eslint/utils
- @angular/material
- @angular/platform-server
- @angular/ssr
- @ngrx/router-store
- ini
- nodemon
- session-file-store
- ws
- xmlhttprequest-ssl

2. Moved test-only dependency to devDependencies:
- require-directory

3. Removed unused dev dependencies:
- @types/chai-as-promised
- chai-as-promised
- chai-http
- circular-dependency-plugin
- codelyzer
- cucumber-html-report
- cucumber-html-reporter
- eslint-config-standard
- eslint-plugin-import
- eslint-plugin-n
- eslint-plugin-promise
- eslint-plugin-standard
- jasmine-reporters
- karma-phantomjs-launcher
- mocha-jenkins-reporter
- nock
- nsp
- proxyquire
- selenium-standalone
- tsickle
- tslint
- watch
- webdriverio
- when

4. Library peer dependency cleanup:
- Removed @angular/material and @ngrx/router-store from projects/media-viewer/package.json peerDependencies

5. Peer dependency fixes:
- Updated zone.js to ~0.15.0
- Updated karma-jasmine to ^5.0.0
- Added @typescript-eslint/types and @typescript-eslint/utils (7.16.0)
- Added hammerjs ^2.0.8

### Files Updated
- package.json
- projects/media-viewer/package.json
- yarn.lock (pending; yarn install failed due to permissions/network)
