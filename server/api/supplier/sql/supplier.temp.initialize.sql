/*
On start, create the Supplier table if it's not present.
*/

IF (OBJECT_ID('TempSupplier', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TempSupplier] (
    [@url] nvarchar(max) NULL,
        [City] nvarchar(max) NULL,
        [Email] nvarchar(max) NULL,
        [Name] nvarchar(1024) NULL,
        [OrganisationNumber] nvarchar(9) NULL,
        [Phone] nvarchar(9) NULL,
        [SupplierNumber] nvarchar(max) NULL,
        [ZipCode] nvarchar(10) NULL,
        [IsCurrent] bit NULL DEFAULT 1,
        [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
        [EndDate] datetime2 NULL,
        [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END
