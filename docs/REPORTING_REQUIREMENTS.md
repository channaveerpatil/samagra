# Reporting V1 Requirements

## 1. Objective

Implement a frontend only Reporting feature in the existing application.

The primary goal is to demonstrate an enterprise style report generation workflow:

User
    ↓
Select report
    ↓
Generate report
    ↓
Report processing
    ↓
Report completed
    ↓
Notification created
    ↓
Download Excel

This is Phase 1 of the Reporting capability.

Do NOT implement backend APIs, PostgreSQL, queues, S3, authentication, or real server side report generation.

The implementation must use:

1. React
2. TypeScript
3. TanStack Query
4. Mock API
5. API abstraction
6. Existing Feature Flag architecture
7. Existing Notification Center
8. Client side Excel generation

The architecture must be ready to replace the mock implementation with a real backend later.

---

# 2. Existing Application

Before making changes, inspect the existing application architecture.

The application already contains:

1. Authentication
2. RBAC
3. Customers
4. Notifications
5. Approvals
6. TanStack Query
7. Feature Flags
8. API abstraction
9. Mock API implementations
10. Existing Header
11. Existing navigation
12. Existing design system

Follow existing architectural patterns.

Do not introduce a new architecture for Reporting.

The Reporting feature should follow the same pattern already established by Customers, Notifications, and Approvals.

---

# 3. Feature Flag

Add:

VITE_FEATURE_REPORTING=true

Expose it through the existing configuration and feature flag abstraction.

Expected usage:

featureFlags.reporting

When enabled:

Show the Reports navigation item.

When disabled:

Hide the Reports navigation item.

Do not scatter feature flag checks throughout the Reporting feature.

---

# 4. RBAC

Use the existing RBAC architecture.

Do NOT create role checks such as:

if role === SUPER_ADMIN

Use permissions.

Introduce the following permissions only if they do not already exist:

REPORT_VIEW

REPORT_GENERATE

REPORT_DOWNLOAD

Suggested behavior:

SUPER_ADMIN:

REPORT_VIEW
REPORT_GENERATE
REPORT_DOWNLOAD

USER:

REPORT_VIEW
REPORT_GENERATE
REPORT_DOWNLOAD

BASIC_USER:

No report permissions

Adjust the exact mapping according to the existing RBAC design.

The important requirement is that Reporting uses permission based authorization.

---

# 5. Reporting Page

Create:

ReportsPage

The page should display available reports.

For V1 include:

Customer Report

Example:

Customer Report

Description:

Generate an Excel report containing customer information.

[ Generate Report ]

The design should be simple and professional.

Do not build a large dashboard yet.

---

# 6. Report Definition

Create a strongly typed ReportDefinition.

Example:

interface ReportDefinition {
    id: string;
    name: string;
    description: string;
    type: ReportType;
}

Report types for V1:

CUSTOMER

Keep the model extensible for future reports such as:

SALES
APPROVAL
AUDIT
USER
PROJECT

Do not implement those reports yet.

---

# 7. Report Job

Create a strongly typed ReportJob model.

Example:

interface ReportJob {
    id: string;
    reportType: ReportType;
    reportName: string;
    status: ReportJobStatus;
    createdAt: string;
    completedAt?: string;
    fileName?: string;
}

Statuses:

QUEUED

PROCESSING

COMPLETED

FAILED

The UI must clearly display the current status.

---

# 8. Mock API

Create a Reporting API abstraction.

Expected methods:

getReports()

generateReport(reportType)

getReportJob(id)

downloadReport(id)

Future API contract:

GET /api/reports

POST /api/reports

GET /api/reports/:id

GET /api/reports/:id/download

Do NOT implement backend endpoints.

---

# 9. Mock Async Processing

The mock implementation must simulate asynchronous report generation.

When the user clicks:

Generate Report

The mock API should:

1. Create a report job.
2. Set status to QUEUED.
3. Simulate processing.
4. Change status to PROCESSING.
5. Generate the Excel file.
6. Change status to COMPLETED.
7. Make the generated file available for download.

Use a reasonable simulated delay.

The UI must NOT freeze during report generation.

Do not block the browser with synchronous processing.

---

# 10. TanStack Query

Use TanStack Query for report state.

Create hooks similar to:

useReports()

useReportJobs()

useReportJob(id)

useGenerateReport()

useDownloadReport()

Use appropriate query keys.

Example:

['reports']

['reports', 'jobs']

['reports', 'job', id]

Do not keep report job state independently in multiple components.

Use TanStack Query as the source of truth.

---

# 11. Report Generation

When the user clicks:

Generate Report

Start the mock report generation process.

Immediately show:

QUEUED

Then:

PROCESSING

Then:

COMPLETED

The user should be able to continue using the application while the report is being generated.

Do not block the page.

---

# 12. Report Status UI

Show clear status indicators:

Queued

Processing

Completed

Failed

Example:

Customer Report

Status: Processing

Generating your report...

When completed:

Status: Completed

Ready to download

Do not rely only on colors to communicate status.

---

# 13. Progress Indicator

During processing show a progress indicator.

The exact percentage does not need to represent real processing progress.

It can be simulated.

Example:

Generating report...

████████████░░░░ 75%

The progress must be clearly presented as simulated processing if necessary.

Do not create a fake backend progress API.

---

# 14. Excel Generation

Generate a real `.xlsx` file on the frontend for V1.

Use an established Excel generation library only if one already exists in the project.

If no suitable library exists, introduce a small, well established dependency such as:

xlsx

Do not create a custom Excel file format implementation.

The generated file should contain realistic Customer data.

Suggested columns:

Customer ID

Customer Name

Email

Status

Created Date

Country

The file should be a valid Excel file.

Example filename:

customer-report-2026-08-23.xlsx

Generate the filename dynamically based on the current date.

---

# 15. Mock Customer Data

Use the existing Customer data source where practical.

Do not duplicate large amounts of customer mock data unnecessarily.

The report should represent realistic application data.

If the existing Customer API cannot reasonably be reused for the report mock, create a small reporting dataset and document the reason.

---

# 16. Notification Integration

This is an important part of Reporting V1.

When the report completes successfully:

Create a notification using the existing Notification API abstraction.

Example:

Type:

REPORT

Title:

Customer Report Ready

Message:

Your Customer Report is ready to download.

The notification must appear in the existing Notification Center.

Do NOT directly modify NotificationBell state.

Do NOT create a second notification system.

Use:

notificationsApi.create()

or the existing notification abstraction.

After creating the notification:

Invalidate the notification query so the existing bell badge updates automatically.

---

# 17. Download Icon in Notification

When a report notification is associated with a downloadable report, display a download action in the notification.

Example:

Customer Report Ready

Your Customer Report is ready to download.

Generated just now

                         [ Download ↓ ]

The user should be able to click the download action.

The download action should:

1. Prevent opening unrelated notification navigation.
2. Download the generated Excel file.
3. Use the existing Reporting API abstraction.
4. Respect REPORT_DOWNLOAD permission.

Do not expose raw internal file paths.

---

# 18. Notification Data Model Extension

Extend the existing notification model only if necessary.

For report notifications, support optional metadata.

Example:

interface NotificationMetadata {
    reportId?: string;
    downloadAvailable?: boolean;
}

Do not create a Reporting specific notification component.

The existing Notification Center should remain reusable.

A generic notification can optionally contain:

action

action type

metadata

or another clean abstraction that fits the existing design.

Do not hardcode:

if notification.type === REPORT

throughout the Notification Center.

Keep the design extensible.

---

# 19. Download Permission

The download action must use:

can('REPORT_DOWNLOAD')

Do not use role names.

If the user does not have REPORT_DOWNLOAD:

The notification can still be visible.

The download action must not be available.

---

# 20. Report History

On the Reports page, show recently generated reports.

Example:

Recent Reports

| Report | Status | Created | Action |
|--------|--------|---------|--------|
| Customer Report | Completed | Just now | Download |
| Customer Report | Processing | 1 min ago | Processing |
| Customer Report | Failed | Yesterday | Retry |

For V1, keep history in mock memory.

No persistence is required.

---

# 21. Retry Failed Reports

If a report enters:

FAILED

Show:

Retry

Clicking Retry should start a new report job.

Do not mutate the old failed job back to PROCESSING.

Create a new job.

---

# 22. Multiple Report Jobs

The application must support multiple report jobs.

Example:

User clicks Generate Report.

Then clicks Generate Report again.

Both jobs should be represented independently.

Do not assume only one report can exist at a time.

---

# 23. Error Handling

Handle:

Report generation failure

Excel generation failure

Download failure

Notification creation failure

Notification creation failure must NOT cause an otherwise successful report generation to be considered failed.

Primary operation:

Report generation

Secondary operation:

Notification creation

Log secondary notification failures using the existing logging mechanism.

---

# 24. Loading States

Show appropriate states for:

Loading reports

Generating report

Downloading report

Retrying report

Do not freeze the entire application while a report is being generated.

---

# 25. Empty State

If no reports have been generated:

Show:

No reports generated yet.

Provide:

Generate Report

---

# 26. API Architecture

Follow this architecture:

ReportsPage

↓

TanStack Query Hooks

↓

reportsApi

↓

mockReportsApi

Later:

ReportsPage

↓

TanStack Query Hooks

↓

reportsApi

↓

realReportsApi

↓

Backend

The React components must not know whether the implementation is mock or real.

---

# 27. Future Backend Architecture

The frontend should be designed for this future architecture:

POST /api/reports

↓

Backend creates report job

↓

Queue

↓

Report Worker

↓

Generate Excel

↓

Object Storage

↓

Report Completed

↓

Notification

↓

Download URL

The backend should eventually handle the actual asynchronous processing.

Do NOT implement this architecture now.

Only make the frontend compatible with it.

---

# 28. Component Structure

Follow existing conventions.

Possible structure:

src/features/reports/

    types.ts

    api/
        reportsApi.types.ts
        mockReports.ts
        mockReportsApi.ts
        realReportsApi.ts
        reportsApi.ts
        queryKeys.ts

    hooks/
        useReports.ts
        useReportJobs.ts
        useReportJob.ts
        useGenerateReport.ts
        useDownloadReport.ts

    components/
        ReportCard.tsx
        ReportStatusChip.tsx
        ReportHistoryTable.tsx
        ReportProgress.tsx
        ReportEmptyState.tsx

Adapt this to the existing application.

Do not blindly create duplicate infrastructure.

---

# 29. Styling

Follow the existing application styling architecture.

Do not introduce:

Inline CSS

New CSS frameworks

New component libraries

New design systems

Reuse existing components.

The Reports page should look like it belongs to the existing application.

---

# 30. Accessibility

All buttons must be keyboard accessible.

Download actions must have meaningful accessible labels.

Progress indicators should provide appropriate accessible information.

Do not rely only on color for report status.

Dialogs and popovers must follow the existing accessibility patterns.

---

# 31. Constraints

Do NOT implement:

Backend

PostgreSQL

Prisma

MongoDB

Redis

SQS

Kafka

S3

Authentication

Real background workers

Real server side Excel generation

Email notifications

Scheduled reports

Report builder

Dynamic report queries

AI generated reports

Complex analytics

Do not overengineer Reporting V1.

---

# 32. Definition of Done

Reporting V1 is complete when:

1. Reporting feature flag exists.
2. Reports navigation exists.
3. Reports page exists.
4. Customer Report exists.
5. Generate Report works.
6. Mock asynchronous processing works.
7. QUEUED state works.
8. PROCESSING state works.
9. COMPLETED state works.
10. FAILED state works.
11. Progress indicator works.
12. Real XLSX file is generated.
13. Report history works.
14. Retry works.
15. Completion creates a Notification.
16. Notification appears in existing Notification Center.
17. Notification displays Download action.
18. Download action downloads the XLSX file.
19. REPORT_VIEW permission works.
20. REPORT_GENERATE permission works.
21. REPORT_DOWNLOAD permission works.
22. Existing RBAC continues working.
23. Existing Notifications continue working.
24. Existing Approvals continue working.
25. Existing Customers continue working.
26. No backend dependency exists.
27. TypeScript passes.
28. ESLint passes.
29. Build passes.

---

# 33. Verification

Run:

npm run build

npm run lint

Run the existing test suite if available.

Manually verify:

1. Reporting flag ON.
2. Reporting flag OFF.
3. User with REPORT_VIEW can see Reports.
4. User without REPORT_VIEW cannot access Reports.
5. Generate permission controls Generate Report.
6. Download permission controls Download.
7. Report starts as QUEUED.
8. Report moves to PROCESSING.
9. Report becomes COMPLETED.
10. Excel file is valid.
11. Excel file downloads successfully.
12. Notification appears.
13. Notification unread count updates.
14. Notification contains Download action.
15. Download from Notification works.
16. Failed report displays FAILED.
17. Retry creates a new job.
18. Multiple report jobs can exist.
19. Existing RBAC works.
20. Existing Approval works.
21. Existing Notifications work.
22. Existing Customers work.

---

# 34. Final Implementation Report

After implementation provide:

1. Files created.
2. Files modified.
3. Architecture implemented.
4. API contract.
5. TanStack Query hooks.
6. Mock API implementation.
7. Excel generation implementation.
8. Async processing simulation.
9. Notification integration.
10. Notification download implementation.
11. RBAC permissions.
12. Feature flag.
13. Verification performed.
14. Limitations.
15. Recommended next architectural step.

Do not implement anything outside this requirement.