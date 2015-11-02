/*
On start, create the Customer table if it's not present.
*/

IF (OBJECT_ID('Customer', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Customer] (
    [CustomerID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [@url] nvarchar(max) NULL,
    [Address1] nvarchar(1024) NULL,
    [Address2] nvarchar(1024) NULL,
    [City] nvarchar(1024) NULL,
    [CustomerNumber] nvarchar(1024) NULL,
    [Email] nvarchar(1024) NULL,
    [Name] nvarchar(1024) NULL,
    [OrganisationNumber] nvarchar(30) NULL,
    [Phone] nvarchar(1024) NULL,
    [ZipCode] nvarchar(10) NULL,
    [IsCurrent] bit NULL DEFAULT 1,
    [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
    [EndDate] datetime2 NULL,
    [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END
