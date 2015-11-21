/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Invoice', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[Invoice];
END
