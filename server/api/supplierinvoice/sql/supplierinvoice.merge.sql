/*
Slowly Changing Dimensions for the SupplierInvoice table.
This merges from TempSupplierInvoice into SupplierInvoice,
and upon change disables the old row and inserts a new row.
*/



INSERT INTO [dbo].[SupplierInvoice] (
        [@url]
      , [Balance]
      , [Booked]
      , [Cancel]
      , [DueDate]
      , [GivenNumber]
      , [InvoiceDate]
      , [InvoiceNumber]
      , [SupplierNumber]
      , [SupplierName]
      , [Total]
  )
SELECT
        [@url]
      , [Balance]
      , [Booked]
      , [Cancel]
      , [DueDate]
      , [GivenNumber]
      , [InvoiceDate]
      , [InvoiceNumber]
      , [SupplierNumber]
      , [SupplierName]
      , [Total]
FROM (
  MERGE [dbo].[SupplierInvoice] AS [Target]
  USING [dbo].[TempSupplierInvoice] AS [Source]
    ON [Target].GivenNumber = [Source].GivenNumber
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Balance] != [Source].[Balance]
   OR [Target].[Booked] != [Source].[Booked]
   OR [Target].[Cancel] != [Source].[Cancel]
   OR [Target].[DueDate] != [Source].[DueDate]
   OR [Target].[GivenNumber] != [Source].[GivenNumber]
   OR [Target].[InvoiceDate] != [Source].[InvoiceDate]
   OR [Target].[InvoiceNumber] != [Source].[InvoiceNumber]
   OR [Target].[SupplierNumber] != [Source].[SupplierNumber]
   OR [Target].[SupplierName] != [Source].[SupplierName]
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
      , [Cancel]
      , [DueDate]
      , [GivenNumber]
      , [InvoiceDate]
      , [InvoiceNumber]
      , [SupplierNumber]
      , [SupplierName]
      , [Total]
    ) VALUES (
        [Source].[@url]
      , [Source].[Balance]
      , [Source].[Booked]
      , [Source].[Cancel]
      , [Source].[DueDate]
      , [Source].[GivenNumber]
      , [Source].[InvoiceDate]
      , [Source].[InvoiceNumber]
      , [Source].[SupplierNumber]
      , [Source].[SupplierName]
      , [Source].[Total]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [GivenNumber] IS NOT NULL
;