/*
Inserts one InvoicePayment into the InvoicePayment table.
*/

INSERT INTO [dbo].[InvoicePayment] (
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
  , @PaymentDate
  , @Source
  );
