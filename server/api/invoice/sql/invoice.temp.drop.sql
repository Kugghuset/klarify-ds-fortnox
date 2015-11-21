/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempInvoice', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempInvoice];
END
