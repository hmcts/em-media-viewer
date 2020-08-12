// import { HighlightCreateService } from './highlight-create.service';
// import { of } from 'rxjs';
// import { fakeAsync } from '@angular/core/testing';
//
// describe('HighlightCreateService', () => {
//
//   const mockHighlightModeSubject = { next: () => {} };
//   const toolbarEvents = { highlightModeSubject: mockHighlightModeSubject } as any;
//   const annotationApi = { postAnnotation: () => {}} as any;
//   let saveAnnoAction: any;
//   const mockStore = {
//     select: () => of({
//       styles: { height: 100, width: 100 },
//       scaleRotation: { scale: 1, rotation: 0 }
//     }),
//     dispatch: (action) => { saveAnnoAction = action },
//     pipe: () => of({ annotationSetId: 'annotationSetId', documentId: 'documentId' })
//   } as any;
//
//   let service: HighlightCreateService;
//
//   beforeEach(() => {
//     service = new HighlightCreateService(toolbarEvents, annotationApi, mockStore);
//   });
//
//   it('should create rectangles', fakeAsync(() => {
//     const mockClientRects = [{ top: 80, left: 60 , bottom: 100, right: 70 }] as any;
//     const mockRange = { getClientRects: () => mockClientRects } as any;
//     const mockSelection = {
//       rangeCount: 1,
//       isCollapsed: false,
//       getRangeAt: () => ({ cloneRange: () => mockRange }),
//       removeAllRanges: () => {}
//     } as any;
//     spyOn(window, 'getSelection').and.returnValue(mockSelection);
//
//     const mockElement = getMockElement('');
//     const mockEvent = { target: mockElement } as any;
//     service.zoom = 1;
//     service.allPages = {
//       '1': {
//         scaleRotation: {
//           rotation: 0,
//           scale: 1
//         },
//         styles: {
//           height: 1122,
//           left: 341,
//           width: 793
//         }
//       }
//     };
//
//     const rectangles = service.getRectangles(mockEvent, 1);
//
//     expect(rectangles[0].x).toBe(20);
//     expect(rectangles[0].y).toBe(50);
//     expect(rectangles[0].height).toBe(20);
//     expect(rectangles[0].width).toBe(10);
//   }));
//
//   it('should remove extra padding and transform', () => {
//     spyOn(window, 'getSelection').and.returnValue({} as any);
//
//     const mockElement = getMockElement('scaleX(0.969918) translateX(-110.684px)');
//     const mockEvent = { target: mockElement } as any;
//     service.allPages = {
//       '1': {
//         scaleRotation: {
//           rotation: 0,
//           scale: 1
//         },
//         styles: {
//           height: 1122,
//           left: 341,
//           width: 793
//         }
//       }
//     }
//     service.getRectangles(mockEvent, 1);
//
//     expect(mockElement.parentElement.children[0].style.padding).toBe('0');
//     expect(mockElement.parentElement.children[0].style.transform).not.toContain('translate');
//   });
//
//   it('should remove extra padding and transform with just only translate', () => {
//     spyOn(window, 'getSelection').and.returnValue({} as any);
//
//     const mockElement = getMockElement('translateX(-110.684px) translateY(12px)');
//     const mockEvent = { target: mockElement } as any;
//     service.allPages = {
//       '1': {
//         scaleRotation: {
//           rotation: 0,
//           scale: 1
//         },
//         styles: {
//           height: 1122,
//           left: 341,
//           width: 793
//         }
//       }
//     }
//     service.getRectangles(mockEvent, 1);
//
//     expect(mockElement.parentElement.children[0].style.padding).toBe('0');
//     expect(mockElement.parentElement.children[0].style.transform).not.toContain('translateX');
//   });
//
//   it('should save annotation', () => {
//     const mockRectangles = ['rectangles'] as any;
//     spyOn(mockStore, 'dispatch').and.callThrough();
//
//     service.saveAnnotation(mockRectangles,1);
//
//     expect(mockStore.dispatch).toHaveBeenCalled();
//     expect(saveAnnoAction.payload.page).toBe(1);
//     expect(saveAnnoAction.payload.rectangles).toBe(mockRectangles);
//     expect(saveAnnoAction.payload.documentId).toBe('documentId');
//     expect(saveAnnoAction.payload.annotationSetId).toBe('annotationSetId');
//   });
//
//   it('should reset highlight', () => {
//     spyOn(window.getSelection(), 'removeAllRanges');
//     spyOn(toolbarEvents.highlightModeSubject, 'next');
//
//     service.resetHighlight();
//
//     expect(window.getSelection().removeAllRanges).toHaveBeenCalled();
//     expect(toolbarEvents.highlightModeSubject.next).toHaveBeenCalledWith(false);
//   });
//
//   const getMockElement = (transform: string) => {
//     return {
//       parentElement: ({
//         getBoundingClientRect: () => ({ top: 30, left: 40}),
//         children: [{ style: { padding: '20', transform: transform }}]
//       })
//     };
//   }
// });
