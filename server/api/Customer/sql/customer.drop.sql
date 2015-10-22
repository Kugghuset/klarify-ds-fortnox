/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Customer', 'U') IS NOT NULL)
BEGIN
  DROP TABLE Customer;
END
