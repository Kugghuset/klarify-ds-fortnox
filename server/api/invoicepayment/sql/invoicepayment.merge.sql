/*
Slowly Changing Dimensions for the InvoicePayment table.
This merges from TempInvoicePayment into InvoicePayment,
and upon change disables the old row and inserts a new row.
*/



INSERT INTO [dbo].[InvoicePayment] (
        [@url]
      , [Amount]
      , [Booked]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [InvoiceNumber]
      , [Number]
      , [PaymentDate]
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
      , [PaymentDate]
      , [Source]
FROM (
  MERGE [dbo].[InvoicePayment] AS [Target]
  USING [dbo].[TempInvoicePayment] AS [Source]
    ON [Target].InvoiceNumber = [Source].InvoiceNumber
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Amount] != [Source].[Amount]
   OR [Target].[Booked] != [Source].[Booked]
   OR [Target].[Currency] != [Source].[Currency]
   OR [Target].[CurrencyRate] != [Source].[CurrencyRate]
   OR [Target].[CurrencyUnit] != [Source].[CurrencyUnit]
   OR [Target].[Number] != [Source].[Number]
   OR [Target].[PaymentDate] != [Source].[PaymentDate]
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
      , [PaymentDate]
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
      , [Source].[PaymentDate]
      , [Source].[Source]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [InvoiceNumber] IS NOT NULL
;