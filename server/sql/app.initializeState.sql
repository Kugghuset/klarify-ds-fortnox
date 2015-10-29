/*
On start, create the sprocket's state table if it's not preset.
*/

IF (OBJECT_ID('{{ table_name }}', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[{{ table_name }}] (
    [StateID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [DateUpdated] datetime2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdateMethod] nvarchar NULL DEFAULT 'schedule'
  )
END
