"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPROVAL_REVIEWER_GROUP = void 0;
// Approval requests aren't routed to one specific person — any Super Admin,
// Admin or Manager can act on any pending request, so responses always point
// `approver` at this shared placeholder rather than a real user (mirrors the
// frontend's APPROVAL_REVIEWER_GROUP constant).
exports.APPROVAL_REVIEWER_GROUP = {
    id: 'approval-reviewers',
    name: 'Super Admin / Admin / Manager',
};
//# sourceMappingURL=Approval.js.map