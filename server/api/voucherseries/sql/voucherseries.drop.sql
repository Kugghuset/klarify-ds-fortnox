/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Voucherseries', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[Voucherseries];
END
