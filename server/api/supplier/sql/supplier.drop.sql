/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Supplier', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[Supplier];
END
