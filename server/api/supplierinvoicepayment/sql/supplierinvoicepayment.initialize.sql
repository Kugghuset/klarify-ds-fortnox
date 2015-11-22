/*
On start, create the SupplierInvoicePayment table if it's not present.
*/

IF (OBJECT_ID('SupplierInvoicePayment', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[SupplierInvoicePayment] (
    [SupplierInvoicePaymentID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [@url] nvarchar(max) NULL,
    [Amount] float NOT NULL,
    [Booked] bit NULL,
    [Currency] nvarchar(3) NULL,
    [CurrencyRate] float NULL,
    [CurrencyUnit] float NULL,
    [InvoiceNumber] int NOT NULL,
    [Number] int NULL,
    [Source] nvarchar(max) NULL,
    [IsCurrent] bit NULL DEFAULT 1,
    [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
    [EndDate] datetime2 NULL,
    [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END
