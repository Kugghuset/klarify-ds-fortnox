/*
Gets all active SupplierInvoicePayment from the database.
*/

SELECT
      [SupplierInvoicePaymentID]
        [@url]
      , [Amount]
      , [Booked]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [InvoiceNumber]
      , [Number]
      , [Source]
      , [IsCurrent]
FROM [dbo].[SupplierInvoicePayment]
WHERE [IsCurrent] = 1;