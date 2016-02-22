/*
On start, create the Voucher table if it's not present.
*/

IF (OBJECT_ID('Voucher', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Voucher] (
    [VoucherID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [@url] nvarchar(max) NULL,
    [ReferenceNumber] nvarchar(max) NULL,
    [ReferenceType] nvarchar(max) NULL,
    [VoucherNumber] int NULL DEFAULT 1,
    [VoucherSeries] nvarchar(max) NULL,
    [Year] int NULL,
    [IsCurrent] bit NULL DEFAULT 1,
    [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
    [EndDate] datetime2 NULL,
    [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END
