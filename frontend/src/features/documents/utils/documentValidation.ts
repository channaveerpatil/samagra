export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.csv', '.png', '.jpg', '.jpeg'];

export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.ms-excel',
  'image/png',
  'image/jpeg',
];

function getExtension(fileName: string): string {
  const index = fileName.lastIndexOf('.');
  return index === -1 ? '' : fileName.slice(index).toLowerCase();
}

// Client-side validation is a UX convenience only — the backend re-validates
// type and size and is the real security boundary.
export function validateDocumentFile(file: File | undefined): string | undefined {
  if (!file) {
    return 'Please select a file.';
  }

  const extension = getExtension(file.name);
  const isAcceptedExtension = ACCEPTED_EXTENSIONS.includes(extension);
  const isAcceptedMimeType = !file.type || ACCEPTED_MIME_TYPES.includes(file.type);
  if (!isAcceptedExtension || !isAcceptedMimeType) {
    return 'File type is not supported.';
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File size must be 10 MB or less.';
  }

  return undefined;
}
