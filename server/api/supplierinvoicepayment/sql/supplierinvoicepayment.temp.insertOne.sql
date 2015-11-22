/*
Inserts one InvoicePayment into the TempInvoicePayment table.
*/

INSERT INTO [dbo].[TempInvoicePayment] (
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
  , @Balance
  , @Booked
  , @Currency
  , @CurrencyRate
  , @CurrencyUnit
  , @InvoiceNumber
  , @Number
  , @Source
  );
