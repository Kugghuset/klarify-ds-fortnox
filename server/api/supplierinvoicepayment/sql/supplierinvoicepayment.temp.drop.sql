/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempSupplierInvoicePayment', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempSupplierInvoicePayment];
END
