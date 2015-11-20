/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempSupplier', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempSupplier];
END
