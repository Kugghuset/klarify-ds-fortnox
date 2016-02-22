/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
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
  FROM [dbo].[Supplier];

  ELSE
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
  FROM [dbo].[Supplier];

