/*
Drops the {{ table_name }} table.
*/

IF (OBJECT_ID('{{ table_name }}', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[{{ table_name }}];
END
