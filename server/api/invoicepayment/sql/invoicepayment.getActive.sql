/*
Gets all active InvoicePayments from the database.
*/

SELECT
      [InvoicePaymentID]
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
      , [IsCurrent]
FROM [dbo].[InvoicePayment]
WHERE [IsCurrent] = 1;