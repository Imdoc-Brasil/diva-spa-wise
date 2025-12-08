# Implementation Plan - Finance & Fiscal Enhancements (COMPLETED)

This update introduces advanced financial management features, focusing on Accounts Payable automation and Fiscal Document management, preparing the system for future API integrations.

## 1. Accounts Payable Automation
**Goal:** Streamline the process of registering and paying expenses.
- **Smart Upload (Simulation)**: `NewTransactionModal` now accepts file uploads (PDF/Image) for expenses. A simulated OCR process extracts:
  - Amount
  - Date
  - Description
  - Category
- **Enhanced expense details**:
  - `DueDate`: Track when a payment is actually due.
  - `SourceAccount`: Link expenses (and income) to specific bank accounts (Cash, Bank, Card Machine).
  - `Recurrence`: Create recurring expenses (installments or fixed subscriptions) automatically generating multiple transaction entries.
- **Payables Dashboard**: New tab in Finance Module to view unpaid expenses, highlighting overdue items.

## 2. Fiscal Documents Module
**Goal:** Manage tax compliance and document emission.
- **Fiscal Tab**: A dedicated area in the Finance Module for:
  - **Pending Emissions**: Automatically lists fully paid income transactions that lack a fiscal record.
  - **Emission History**: View all emitted NFS-e, NF-e, and Receipts.
- **Smart Recommendation**:
  - Services (ISS) -> Suggests NFS-e or Simple Receipt.
  - Products (ICMS) -> Suggests NF-e.

## 3. Receipt Emission System
**Goal:** Provide professional receipts for clients.
- **ReceiptPreviewModal**: A printable, professional receipt layout including:
  - Clinic branding (Logo, Address, Phone).
  - Client details.
  - Service description and amount.
  - Signature lines for staff.
- **Workflow**: 
  - Click "Recibo Simples" on a pending transaction -> Open Preview -> Print.
- **Simulated NFS-e/NF-e**: "Emitir NFS-e" button creates a `FiscalRecord` and links it to the transaction, marking it as compliant.

## 4. Technical Refactoring
- **Data Context**:
  - Added `accounts` and `fiscalRecords` state management.
  - Implemented `updateTransaction` to allow linking documents after transaction creation.
  - Fixed linting issues and improved type safety for `Organization` and `BusinessConfig`.
- **Type Definitions**:
  - Extended `Transaction` with `sourceAccountId`, `fiscalRecordId`.
  - Added `BankAccount` and `FiscalRecord` interfaces.

## Next Steps
- **External Integration**: Replace simulated "Emitir" logic with actual API calls to municipal tax systems (e.g., eNotas, FocusNFe).
- **OCR Integration**: Replace simulated file upload with AWS Textract or similar service for real invoice parsing.
