/*
Drops the table if it exists.
*/

IF (OBJECT_ID('InvoicePayment', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[InvoicePayment];
END
