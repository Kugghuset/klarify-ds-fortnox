/*
Slowly Changing Dimensions for the Account table.
This merges from TempAccount into Account,
and upon change disables the old row and inserts a new row.
*/


INSERT INTO [dbo].[Account] (
      [@url]
    , [active]
    , [Description]
    , [Number]
    , [SRU]
    , [Year]
  )
SELECT
      [@url]
    , [active]
    , [Description]
    , [Number]
    , [SRU]
    , [Year]
FROM (
  MERGE [dbo].[Account] AS [Target]
  USING [dbo].[TempAccount] AS [Source]
    ON [Target].Number = [Source].Number
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[active] != [Source].[active]
   OR [Target].[Description] != [Source].[Description]
   OR [Target].[Number] != [Source].[Number]
   OR [Target].[SRU] != [Source].[SRU]
   OR [Target].[Year] != [Source].[Year]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
      [@url]
    , [active]
    , [Description]
    , [Number]
    , [SRU]
    , [Year]
    ) VALUES (
        [Source].[@url]
      , [Source].[active]
      , [Source].[Description]
      , [Source].[Number]
      , [Source].[SRU]
      , [Source].[Year]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [Number] IS NOT NULL
;