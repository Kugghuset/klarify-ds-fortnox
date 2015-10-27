/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
        [CustomerID]
      , [@url]
      , [Address1]
      , [Address2]
      , [City]
      , [CustomerNumber]
      , [Email]
      , [Name]
      , [OrganisationNumber]
      , [Phone]
      , [ZipCode]
      , [IsCurrent]
  FROM [dbo].[Customer];

  ELSE
    SELECT
        [CustomerID]
      , [@url]
      , [Address1]
      , [Address2]
      , [City]
      , [CustomerNumber]
      , [Email]
      , [Name]
      , [OrganisationNumber]
      , [Phone]
      , [ZipCode]
      , [IsCurrent]
  FROM [dbo].[Customer];
