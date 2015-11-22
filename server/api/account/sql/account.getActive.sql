/*
Gets all active Accounts from the database.
*/

SELECT
      [AccountID]
      , [@url]
      , [Active]
      , [Description]
      , [Number]
      , [SRU]
      , [Year]
    , [IsCurrent]
FROM [dbo].[Account]
WHERE [IsCurrent] = 1;