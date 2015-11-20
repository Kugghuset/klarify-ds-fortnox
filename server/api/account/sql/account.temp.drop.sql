/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempAccount', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempAccount];
END
