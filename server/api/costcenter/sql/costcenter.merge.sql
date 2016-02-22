/*
Slowly Changing Dimensions for the Costcenter table.
This merges from TempCostcenter into Costcenter,
and upon change disables the old row and inserts a new row.
*/



INSERT INTO [dbo].[Costcenter] (
    [@url]
  , [Code]
  , [Description]
  , [Note]
  , [Active]
  )
SELECT
    [@url]
  , [Code]
  , [Description]
  , [Note]
  , [Active]
FROM (
  MERGE [dbo].[Costcenter] AS [Target]
  USING [dbo].[TempCostcenter] AS [Source]
    ON [Target].Code = [Source].Code
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Description] != [Source].[Description]
   OR [Target].[Note] != [Source].[Note]
   OR [Target].[Active] != [Source].[Active]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [@url]
      , [Code]
      , [Description]
      , [Note]
      , [Active]
    ) VALUES (
        [Source].[@url]
      , [Source].[Code]
      , [Source].[Description]
      , [Source].[Note]
      , [Source].[Active]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [Code] IS NOT NULL
;