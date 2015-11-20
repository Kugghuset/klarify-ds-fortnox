/*
Gets all active suppliers from the database.
*/

SELECT
      [SupplierID]
     , [@url]
     , [City]
     , [Email]
     , [Name]
     , [OrganisationNumber]
     , [Phone]
     , [SupplierNumber]
     , [ZipCode]
     , [IsCurrent]
FROM [dbo].[Supplier]
WHERE [IsCurrent] = 1;