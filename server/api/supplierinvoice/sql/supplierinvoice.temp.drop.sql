/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempSupplierInvoice', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempSupplierInvoice];
END
