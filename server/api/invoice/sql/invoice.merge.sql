/*
Slowly Changing Dimensions for the Invoice table.
This merges from TempInvoice into Invoice,
and upon change disables the old row and inserts a new row.
*/



INSERT INTO [dbo].[Invoice] (
       [@url]
      , [Balance]
      , [Booked]
      , [Cancelled]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [CustomerName]
      , [CustomerNumber]
      , [DocumentNumber]
      , [DueDate]
      , [ExternalInvoiceReference1]
      , [ExternalInvoiceReference2]
      , [InvoiceDate]
      , [NoxFinans]
      , [OCR]
      , [WayOfDelivery]
      , [TermsOfPayment]
      , [Project]
      , [Sent]
      , [Total]
  )
SELECT
       [@url]
      , [Balance]
      , [Booked]
      , [Cancelled]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [CustomerName]
      , [CustomerNumber]
      , [DocumentNumber]
      , [DueDate]
      , [ExternalInvoiceReference1]
      , [ExternalInvoiceReference2]
      , [InvoiceDate]
      , [NoxFinans]
      , [OCR]
      , [WayOfDelivery]
      , [TermsOfPayment]
      , [Project]
      , [Sent]
      , [Total]
FROM (
  MERGE [dbo].[Invoice] AS [Target]
  USING [dbo].[TempInvoice] AS [Source]
    ON [Target].DocumentNumber = [Source].DocumentNumber
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Balance] != [Source].[Balance]
   OR [Target].[Booked] != [Source].[Booked]
   OR [Target].[Cancelled] != [Source].[Cancelled]
   OR [Target].[Currency] != [Source].[Currency]
   OR [Target].[CurrencyRate] != [Source].[CurrencyRate]
   OR [Target].[CurrencyUnit] != [Source].[CurrencyUnit]
   OR [Target].[CustomerName] != [Source].[CustomerName]
   OR [Target].[CustomerNumber] != [Source].[CustomerNumber]
   OR [Target].[DocumentNumber] != [Source].[DocumentNumber]
   OR [Target].[DueDate] != [Source].[DueDate]
   OR [Target].[ExternalInvoiceReference1] != [Source].[ExternalInvoiceReference1]
   OR [Target].[ExternalInvoiceReference2] != [Source].[ExternalInvoiceReference2]
   OR [Target].[InvoiceDate] != [Source].[InvoiceDate]
   OR [Target].[NoxFinans] != [Source].[NoxFinans]
   OR [Target].[OCR] != [Source].[OCR]
   OR [Target].[WayOfDelivery] != [Source].[WayOfDelivery]
   OR [Target].[TermsOfPayment] != [Source].[TermsOfPayment]
   OR [Target].[Project] != [Source].[Project]
   OR [Target].[Sent] != [Source].[Sent]
   OR [Target].[Total] != [Source].[Total]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
         [@url]
       , [Balance]
       , [Booked]
       , [Cancelled]
       , [Currency]
       , [CurrencyRate]
       , [CurrencyUnit]
       , [CustomerName]
       , [CustomerNumber]
       , [DocumentNumber]
       , [DueDate]
       , [ExternalInvoiceReference1]
       , [ExternalInvoiceReference2]
       , [InvoiceDate]
       , [NoxFinans]
       , [OCR]
       , [WayOfDelivery]
       , [TermsOfPayment]
       , [Project]
       , [Sent]
       , [Total]
    ) VALUES (
        [Source].[@url]
      , [Source].[Balance]
      , [Source].[Booked]
      , [Source].[Cancelled]
      , [Source].[Currency]
      , [Source].[CurrencyRate]
      , [Source].[CurrencyUnit]
      , [Source].[CustomerName]
      , [Source].[CustomerNumber]
      , [Source].[DocumentNumber]
      , [Source].[DueDate]
      , [Source].[ExternalInvoiceReference1]
      , [Source].[ExternalInvoiceReference2]
      , [Source].[InvoiceDate]
      , [Source].[NoxFinans]
      , [Source].[OCR]
      , [Source].[WayOfDelivery]
      , [Source].[TermsOfPayment]
      , [Source].[Project]
      , [Source].[Sent]
      , [Source].[Total]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [DocumentNumber] IS NOT NULL
;