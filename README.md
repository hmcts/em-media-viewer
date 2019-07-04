# @hmcts/media-viewer 
[![Coverage Status](https://coveralls.io/repos/github/hmcts/media-viewer/badge.svg?branch=master)](https://coveralls.io/github/hmcts/media-viewer?branch=upload-npm-in-pipeline)
[![Build Status](https://travis-ci.com/hmcts/media-viewer.svg?branch=master)](https://travis-ci.com/hmcts/media-viewer)

This is an angular library that provides components to view and annotate PDF documents, as well as view images.

### Building annotation library
- npm run package
- distributable will be created under dist/media-viewer

### Running locally - dev mode
- npm run package
- npm run start:node
- npm run start:ng

### Add as a dependency in your angular app

add @hmcts/media-viewer as a dependency in package.json

```
npm install --save @hmcts/media-viewer
```

import MediaViewerModule and declare it in your NgModule imports.

```
import { MediaViewerModule } from 'media-viewer';

@NgModule({
  imports: [
    ...,
    MediaViewerModule,
  ]
})
```

import assets to your angular.json

```
{
    "glob": "**/*",
    "input": "node_modules/@hmcts/media-viewer/assets",
    "output": "/assets"
}
```

and styles

```
"styles": [
  "node_modules/@hmcts/media-viewer/assets/aui-styles.scss",
  ...
],
```

component entry point:

```
<mv-media-viewer [url]="'assets/example.pdf'"
                 [downloadFileName]="'example.pdf'"
                 [showToolbar]="true"
                 [contentType]="'pdf'">
</mv-media-viewer>  
```

### Toolbar

The toolbar may be toggled off by setting `showToolbase` to false. The toolbar itself is available as a module that can be included into the DOM at a different location if necessary. 

### Running development application (only for use with hmcts document store)
- set environment variable to define if app connects to localhost or aat:
  ```
  export APP_ENV=local
  ```
- start app server
  ```
  yarn install; export S2S_SECRET={{insert secret here}}; export IDAM_SECRET={{insert secret here}}; export APP_ENV=local; yarn start-dev-proxy;
  ```
- start node server
  ```
  yarn install; export S2S_SECRET={{insert secret here}}; export IDAM_SECRET={{insert secret here}}; export APP_ENV=local; yarn watch-dev-node;
  ``` 
- go to http://localhost:3000 and the viewer should load the document.

### E2e Tests/ Cucumber Tests
 ```
  npm run package, npm run cucumber-e2e
  ```
  
   
  

