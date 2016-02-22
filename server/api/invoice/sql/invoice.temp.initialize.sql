/*
On start, create the Invoice table if it's not present.
*/

IF (OBJECT_ID('TempInvoice', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TempInvoice] (
 [@url] nvarchar(max) NULL,
    [Balance] float  NULL,
    [Booked] bit NULL,
    [Cancelled] bit NULL,
    [Currency] nvarchar(max) NULL,
    [CurrencyRate] float NULL,
    [CurrencyUnit] float NULL,
    [CustomerName] nvarchar(1024) NULL,
    [CustomerNumber] nvarchar(max) NOT NULL,
    [DocumentNumber] int NULL,
    [DueDate] datetime2 NULL,
    [ExternalInvoiceReference1] nvarchar(80) NULL,
    [ExternalInvoiceReference2] nvarchar(80) NULL,
    [InvoiceDate] datetime2 NULL,
    [NoxFinans] bit NULL,
    [OCR] nvarchar(max) NULL,
    [WayOfDelivery] nvarchar(max) NULL,
    [TermsOfPayment] nvarchar(max) NULL,
    [Project] nvarchar(max) NULL,
    [Sent]  bit NULL,
    [Total]  float NULL,
    [IsCurrent] bit NULL DEFAULT 1,
    [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
    [EndDate] datetime2 NULL,
    [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
)
END
