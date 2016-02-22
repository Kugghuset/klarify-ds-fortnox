/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Voucher', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[Voucher];
END
