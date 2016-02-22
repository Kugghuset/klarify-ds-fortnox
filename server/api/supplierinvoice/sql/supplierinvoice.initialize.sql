/*
On start, create the SupplierInvoice table if it's not present.
*/

IF (OBJECT_ID('SupplierInvoice', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[SupplierInvoice] (
    [SupplierInvoiceID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [@url] nvarchar(max) NULL,
    [Balance] nvarchar(max) NULL,
    [Booked] bit NULL,
    [Cancel] bit NULL,
    [DueDate] datetime2 NULL,
    [GivenNumber] int NULL,
    [InvoiceDate] datetime2 NULL,
    [InvoiceNumber] bigint NULL,
    [SupplierNumber] nvarchar(max) NOT NULL,
    [SupplierName] nvarchar(max) NULL,
    [Total] int NULL,
    [IsCurrent] bit NULL DEFAULT 1,
    [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
    [EndDate] datetime2 NULL,
    [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END
