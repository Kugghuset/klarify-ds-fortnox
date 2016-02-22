/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempInvoicePayment', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempInvoicePayment];
END
