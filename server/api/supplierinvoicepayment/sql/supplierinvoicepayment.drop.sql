/*
Drops the table if it exists.
*/

IF (OBJECT_ID('SupplierInvoicePayment', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[SupplierInvoicePayment];
END
