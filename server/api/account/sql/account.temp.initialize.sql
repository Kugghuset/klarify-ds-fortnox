/*
On start, create the Account table if it's not present.
*/

IF (OBJECT_ID('TempAccount', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TempAccount] (
    [AccountID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
       [@url] nvarchar(max) NULL,
       [Active]  bit NULL DEFAULT 1,
       [Description] nvarchar(200) NOT NULL,
       [Number] int NOT NULL,
       [SRU] int NULL,
       [Year] int NULL
  )
END
