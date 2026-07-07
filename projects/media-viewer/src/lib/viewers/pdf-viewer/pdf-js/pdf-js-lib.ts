import * as pdfjs from 'pdfjs-dist';

(globalThis as typeof globalThis & { pdfjsLib?: typeof pdfjs }).pdfjsLib = pdfjs;

export { pdfjs };
