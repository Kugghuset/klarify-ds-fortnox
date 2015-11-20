/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
        [AccountID]
      , [@url]
      , [Active]
      , [Description]
      , [Number]
      , [SRU]
      , [Year]
  FROM [dbo].[Account];

  ELSE
    SELECT
       [AccountID]
             , [@url]
             , [Active]
             , [Description]
             , [Number]
             , [SRU]
             , [Year]
  FROM [dbo].[Account];
