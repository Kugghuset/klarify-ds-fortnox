/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempVoucherseries', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempVoucherseries];
END
