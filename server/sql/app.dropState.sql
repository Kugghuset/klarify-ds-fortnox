/*
Drops the StateFortnox table.
*/

IF (OBJECT_ID('StateFortnox', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[StateFortnox];
END
