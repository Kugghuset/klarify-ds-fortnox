/*
Gets all active costcenters from the database.
*/

SELECT
      [CostcenterID]
     , [@url]
     , [Code]
     , [Description]
     , [Note]
     , [Active]
     , [IsCurrent]
FROM [dbo].[Costcenter]
WHERE [IsCurrent] = 1;