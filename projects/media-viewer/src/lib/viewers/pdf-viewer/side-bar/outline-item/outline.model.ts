export interface Outline {
  bold: boolean;
  color: Uint8ClampedArray;
  count: number | undefined;
  dest: string | Array<any> | null;
  italic: boolean;
  items: Outline[];
  newWindow: boolean | undefined;
  pageNumber?: number;
  title: string;
  unsafeUrl: string | undefined;
  url: string | null;
}
