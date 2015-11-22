/*
Slowly Changing Dimensions for the SupplierInvoicePayment table.
This merges from TempSupplierInvoicePayment into SupplierInvoicePayment,
and upon change disables the old row and inserts a new row.
*/



INSERT INTO [dbo].[SupplierInvoicePayment] (
        [@url]
      , [Amount]
      , [Booked]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [InvoiceNumber]
      , [Number]
      , [Source]
  )
SELECT
        [@url]
      , [Amount]
      , [Booked]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [InvoiceNumber]
      , [Number]
      , [Source]
FROM (
  MERGE [dbo].[SupplierInvoicePayment] AS [Target]
  USING [dbo].[TempSupplierInvoicePayment] AS [Source]
    ON [Target].Number = [Source].Number
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Amount] != [Source].[Amount]
   OR [Target].[Booked] != [Source].[Booked]
   OR [Target].[Currency] != [Source].[Currency]
   OR [Target].[CurrencyRate] != [Source].[CurrencyRate]
   OR [Target].[CurrencyUnit] != [Source].[CurrencyUnit]
   OR [Target].[Number] != [Source].[Number]
   OR [Target].[Source] != [Source].[Source]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
         [@url]
      , [Amount]
      , [Booked]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [InvoiceNumber]
      , [Number]
      , [Source]
    ) VALUES (
        [Source].[@url]
      , [Source].[Amount]
      , [Source].[Booked]
      , [Source].[Currency]
      , [Source].[CurrencyRate]
      , [Source].[CurrencyUnit]
      , [Source].[InvoiceNumber]
      , [Source].[Number]
      , [Source].[Source]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [Number] IS NOT NULL
;