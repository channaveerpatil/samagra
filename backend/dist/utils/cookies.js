"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCookies = parseCookies;
exports.buildSetCookie = buildSetCookie;
exports.buildClearCookie = buildClearCookie;
function parseCookies(req) {
    const header = req.headers.cookie;
    if (!header) {
        return {};
    }
    return header.split(';').reduce((acc, pair) => {
        const separatorIndex = pair.indexOf('=');
        if (separatorIndex === -1) {
            return acc;
        }
        const name = pair.slice(0, separatorIndex).trim();
        const value = pair.slice(separatorIndex + 1).trim();
        if (name) {
            acc[name] = decodeURIComponent(value);
        }
        return acc;
    }, {});
}
function buildSetCookie(name, value, options) {
    const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
    if (options.maxAgeMs !== undefined) {
        parts.push(`Max-Age=${Math.floor(options.maxAgeMs / 1000)}`);
    }
    if (options.secure) {
        parts.push('Secure');
    }
    return parts.join('; ');
}
function buildClearCookie(name, options) {
    const parts = [`${name}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
    if (options.secure) {
        parts.push('Secure');
    }
    return parts.join('; ');
}
//# sourceMappingURL=cookies.js.map