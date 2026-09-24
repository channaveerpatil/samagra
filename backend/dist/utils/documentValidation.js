"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_EXTENSIONS = exports.ALLOWED_DOCUMENT_TYPES = void 0;
exports.isAllowedDocumentType = isAllowedDocumentType;
// Extension is the primary control (never trust the client-supplied mimetype
// alone); mimeTypes are the values browsers commonly send for that extension,
// checked as defense in depth.
exports.ALLOWED_DOCUMENT_TYPES = [
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
function isAllowedDocumentType(extension, mimeType) {
    const match = exports.ALLOWED_DOCUMENT_TYPES.find((type) => type.extension === extension.toLowerCase());
    return !!match && match.mimeTypes.includes(mimeType);
}
exports.ALLOWED_EXTENSIONS = exports.ALLOWED_DOCUMENT_TYPES.map((type) => type.extension);
//# sourceMappingURL=documentValidation.js.map