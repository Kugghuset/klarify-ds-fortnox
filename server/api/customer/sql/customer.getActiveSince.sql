/*
Gets all active customers from the database.
*/

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
FROM [dbo].[Customer]
WHERE [IsCurrent] = 1
    AND [StartDate] > @dateSince;