/*
Slowly Changing Dimensions for the Voucherseries table.
This merges from TempVoucherseries into Voucherseries,
and upon change disables the old row and inserts a new row.
*/



INSERT INTO [dbo].[Voucherseries] (
    [@url]
  , [Code]
  , [Description]
  , [Manual]
  , [NextVoucherNumber]
  , [Year]
  )
SELECT
    [@url]
  , [Code]
  , [Description]
  , [Manual]
  , [NextVoucherNumber]
  , [Year]
FROM (
  MERGE [dbo].[Voucherseries] AS [Target]
  USING [dbo].[TempVoucherseries] AS [Source]
    ON [Target].Code = [Source].Code
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Description] != [Source].[Description]
   OR [Target].[Manual] != [Source].[Manual]
   OR [Target].[NextVoucherNumber] != [Source].[NextVoucherNumber]
   OR [Target].[Year] != [Source].[Year]
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
      , [Manual]
      , [NextVoucherNumber]
      , [Year]
    ) VALUES (
        [Source].[@url]
      , [Source].[Code]
      , [Source].[Description]
      , [Source].[Manual]
      , [Source].[NextVoucherNumber]
      , [Source].[Year]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [Code] IS NOT NULL
;