/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
        [SupplierInvoiceID]
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
      , [IsCurrent]
  FROM [dbo].[SupplierInvoice];

  ELSE
    SELECT
        [SupplierInvoiceID]
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
      , [IsCurrent]
  FROM [dbo].[SupplierInvoice];

