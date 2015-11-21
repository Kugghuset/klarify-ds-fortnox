/*
Slowly Changing Dimensions for the Vouchertable.
This merges from TempVoucherinto Voucher,
and upon change disables the old row and inserts a new row.
*/



INSERT INTO [dbo].[Voucher] (
       [@url]
     , [ReferenceNumber]
     , [ReferenceType]
     , [VoucherNumber]
     , [VoucherSeries]
     , [Year]
  )
SELECT
       [@url]
     , [ReferenceNumber]
     , [ReferenceType]
     , [VoucherNumber]
     , [VoucherSeries]
     , [Year]
FROM (
  MERGE [dbo].[Voucher] AS [Target]
  USING [dbo].[TempVoucher] AS [Source]
    ON [Target].VoucherNumber = [Source].VoucherNumber
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[ReferenceNumber] != [Source].[ReferenceNumber]
   OR [Target].[ReferenceType] != [Source].[ReferenceType]
   OR [Target].[VoucherSeries] != [Source].[VoucherSeries]
   OR [Target].[Year] != [Source].[Year]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
         [@url]
       , [ReferenceNumber]
       , [ReferenceType]
       , [VoucherNumber]
       , [VoucherSeries]
       , [Year]
    ) VALUES (
        [Source].[@url]
      , [Source].[ReferenceNumber]
      , [Source].[ReferenceType]
      , [Source].[VoucherNumber]
      , [Source].[VoucherSeries]
      , [Source].[Year]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [VoucherNumber] IS NOT NULL
;