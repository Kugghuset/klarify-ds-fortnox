/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempVoucher', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempVoucher];
END
