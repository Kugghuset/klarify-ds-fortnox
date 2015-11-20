/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Account', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[Account];
END
