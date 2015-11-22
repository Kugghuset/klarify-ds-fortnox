/*
Gets all active SupplierInvoice from the database.
*/

SELECT
      [SupplierInvoiceID]
      ,  [@url]
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
      , [IsCurrent]
FROM [dbo].[SupplierInvoice]
WHERE [IsCurrent] = 1;