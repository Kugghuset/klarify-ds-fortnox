/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
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
  FROM [dbo].[InvoicePayment];

  ELSE
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
  FROM [dbo].[InvoicePayment];

