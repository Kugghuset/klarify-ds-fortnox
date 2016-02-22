/*
Gets all active invoices from the database.
*/

SELECT
      [InvoiceID]
      , [@url]
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
      , [IsCurrent]
FROM [dbo].[Invoice]
WHERE [IsCurrent] = 1;