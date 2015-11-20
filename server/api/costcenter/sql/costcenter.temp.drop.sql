/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempCostcenter', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[TempCostcenter];
END
