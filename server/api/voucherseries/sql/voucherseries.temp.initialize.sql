/*
On start, create the Voucherseries table if it's not present.
*/

IF (OBJECT_ID('TempVoucherseries', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TempVoucherseries] (
    [@url] nvarchar(max) NULL,
        [Code] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Manual] bit NULL DEFAULT 1,
        [NextVoucherNumber] int NULL,
        [Year] int NULL,
        [IsCurrent] bit NULL DEFAULT 1,
        [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
        [EndDate] datetime2 NULL,
        [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END

