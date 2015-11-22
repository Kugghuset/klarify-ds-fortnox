/*
Drops the table if it exists.
*/

IF (OBJECT_ID('SupplierInvoice', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[SupplierInvoice];
END
