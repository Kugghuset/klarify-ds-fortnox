/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Costcenter', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[Costcenter];
END
