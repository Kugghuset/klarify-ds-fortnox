/*
Inserts one SupplierInvoicePayment into the InvoicePayment table.
*/

INSERT INTO [dbo].[SupplierInvoicePayment] (
        [@url]
      , [Amount]
      , [Booked]
      , [Currency]
      , [CurrencyRate]
      , [CurrencyUnit]
      , [InvoiceNumber]
      , [Number]
      , [Source]
    )
VALUES (
    @url
  , @Amount
  , @Booked
  , @Currency
  , @CurrencyRate
  , @CurrencyUnit
  , @InvoiceNumber
  , @Number
  , @Source
  );
