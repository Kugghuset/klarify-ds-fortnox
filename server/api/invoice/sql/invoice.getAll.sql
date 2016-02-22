/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
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
  FROM [dbo].[Invoice];

  ELSE
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
  FROM [dbo].[Invoice];

