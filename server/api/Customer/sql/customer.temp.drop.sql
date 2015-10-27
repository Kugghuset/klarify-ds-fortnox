/*
Drops the table if it exists.
*/

IF (OBJECT_ID('TempCustomer', 'U') IS NOT NULL)
BEGIN
  DROP TABLE dbo.TempCustomer;
END
