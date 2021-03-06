/*
On start, create the Costcenter table if it's not present.
*/

IF (OBJECT_ID('Costcenter', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Costcenter] (
    [CostcenterID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [@url] nvarchar(max) NULL,
    [Code] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Note] nvarchar(max) NULL,
    [Active] bit NULL DEFAULT 1,
    [IsCurrent] bit NULL DEFAULT 1,
    [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
    [EndDate] datetime2 NULL,
    [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END
