/*
On start, create the sprocket's state table if it's not preset.
*/

IF (OBJECT_ID('StateFortnox', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[StateFortnox] (
    [StateID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [CustomerDateUpdated] datetime2 NULL
  )
END
