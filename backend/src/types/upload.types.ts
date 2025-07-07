export interface UploadedMedia {
  url: string;
  public_id: string;
  format: string;
  width?: number;
  height?: number;
  size: number;
  name: string;
  uploaded_by: number;
}

export interface UploadedFileMeta {
  key: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
}
