/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
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
  FROM [dbo].[SupplierInvoicePayment];

  ELSE
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
  FROM [dbo].[SupplierInvoicePayment];

