# @hmcts/media-viewer 
[![Coverage Status](https://coveralls.io/repos/github/hmcts/media-viewer/badge.svg?branch=master)](https://coveralls.io/github/hmcts/media-viewer?branch=upload-npm-in-pipeline)
[![Build Status](https://travis-ci.com/hmcts/media-viewer.svg?branch=master)](https://travis-ci.com/hmcts/media-viewer)

This is an angular library that can be used to view and annotate PDF documents and images.

## Running demo app
- yarn package
- yarn start:ng

## Integrating into your own Angular application
add @hmcts/media-viewer as a dependency in package.json

```
npm install --save @hmcts/media-viewer
```

import MediaViewerModule and declare it in your NgModule imports together with NGRX store if you don't have it already .

```
import { MediaViewerModule } from 'media-viewer';

@NgModule({
  imports: [
    ...,
    MediaViewerModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
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

component entry point:

```
<mv-media-viewer [url]="'assets/example.pdf'"
                 [downloadFileName]="'example.pdf'"
                 [showToolbar]="true"
                 [contentType]="'pdf'">
</mv-media-viewer>  
```
### Media Viewer Styles
Add these styles to your component.scss if you need them.
If you're writing your own toolbar styles then do not import those

```
// Import GOV.UK Frontend
@import "~govuk-frontend/govuk/all";
@import "~@hmcts/frontend/all";
// Import Media Viewer Styles
@import "~media-viewer/src/assets/all"; // use this to import all the styles 
```
Alternatively, it is possible to import file by file as required from ```assets/sass``` directory 

eg. ```~media-viewer/assets/sass/toolbar/main```

## Customisations
### Toolbar
The toolbar may be toggled off by setting `showToolbar` to false. The toolbar itself is available as a module that can be included into the DOM at a different location if necessary. 

### Toolbar buttons
Toolbar buttons can be toggled on or off using the 'toolbarButtonOverrides' input.
Each button can toggled on or off as follows:
```
toolbarButtons = { showRotate: true, showDownload: false }

<mv-media-viewer ...
                 [toolbarButtonOverrides]="toolbarButtons">
</mv-media-viewer>  
```
The full list of buttons is as follows:
```
showPrint
showDownload
showNavigation
showZoom
showRotate
showHighlightButton
showDrawButton
showSearchBar
showSidebar
```       

### Media Viewer Height and Width
You can set height and width of the media viewer otherwise it will be set to default settings of 100%.

```
<mv-media-viewer ...
                 [height]="'500px'"
                 [width]="'500px'">
</mv-media-viewer>  
```

### Annotation API
To override the default Annotation API path (or URL for cross domain calls) use "annotationApiUrl" parameter
```
<mv-media-viewer annotationApiUrl=""http://my-gateway.com/my-context-path""  ... >
</mv-media-viewer>
```

## Backend setup
- the media-viewer expects calls to the backend to be proxied by the consuming application. This includes the following APIs:
  - '/documents', endpoint to be proxied to the 'document-store'
  - '/em-anno', endpoint to be proxied to the 'annotations-api', if annotations are turned on
  - '/api/markups', endpoint to be proxied to the 'em-native-pdf-annotator-app', if redaction is turned on
  - '/api/redaction', endpoint to be proxied to the 'em-native-pdf-annotator-app', if redaction is turned on

### Proxying backend Api calls
In order to use annotations/redactions on the media viewer, you need to proxy backend calls.

Example:
```
import * as proxy from "http-proxy-middleware";
```
Annotation Config:
```
const annotation = {
    endpoints: ["/em-anno"],
    target: "Enter URL",
    pathRewrite: {
        "^/em-anno": "/api"
    }
}
```
How to use the proxy:
```
this.app.use(proxy(annotation.endpoints, { target: annotation.target }));
```

## Viewer Exceptions
The Media Viewer will return load status and provide exceptions if thrown for the host application to consume.
It is up to the consuming application whether or not to notify the user of those exceptions, as the Media-Viewer will not  
```
    <mv-media-viewer [url]="'assets/example.pdf'"
                     [downloadFileName]="'example.pdf'"
                     [showToolbar]="true"
                     [contentType]="'pdf'"
                     [enableAnnotations]="true"
                     [enableRedactions]="true"
                     (mediaLoadStatus)="onMediaLoadStatus($event)"
                     (viewerException)="onMediaLoadException($event)">
    </mv-media-viewer>  
```

When exceptions are thrown by the different Media Viewers, the exception is encapsulated in an object called `ViewerException` and passed up the chain to be used by consuming service.

The structure of the `ViewerException` exception class can be seen below:

    exceptionType: error.name,
    detail: {
      httpResponseCode: error.status,
      message: error.message
    }
    
The list of exceptions thrown by the Media Viewer are as follows:
- UnknownErrorException
- MissingPdfException
- InvalidPDFException
- UnexpectedResponseException
- HttpErrorResponse
- PasswordException

## Cucumber Tests
 ```
  npm run package, npm run e2e:cucumber
  ```
