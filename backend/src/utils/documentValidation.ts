export interface AllowedDocumentType {
  extension: string;
  mimeTypes: string[];
}

// Extension is the primary control (never trust the client-supplied mimetype
// alone); mimeTypes are the values browsers commonly send for that extension,
// checked as defense in depth.
export const ALLOWED_DOCUMENT_TYPES: AllowedDocumentType[] = [
  { extension: '.pdf', mimeTypes: ['application/pdf'] },
  {
    extension: '.docx',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  {
    extension: '.xlsx',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  { extension: '.csv', mimeTypes: ['text/csv', 'application/vnd.ms-excel', 'text/plain'] },
  { extension: '.png', mimeTypes: ['image/png'] },
  { extension: '.jpg', mimeTypes: ['image/jpeg'] },
  { extension: '.jpeg', mimeTypes: ['image/jpeg'] },
];

export function isAllowedDocumentType(extension: string, mimeType: string): boolean {
  const match = ALLOWED_DOCUMENT_TYPES.find((type) => type.extension === extension.toLowerCase());
  return !!match && match.mimeTypes.includes(mimeType);
}

export const ALLOWED_EXTENSIONS = ALLOWED_DOCUMENT_TYPES.map((type) => type.extension);
