/*
Inserts one Invoice into the Invoice table.
*/

INSERT INTO [dbo].[Invoice] (
        [@url]
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
    )
VALUES (
    @url
  , @Balance
  , @Booked
  , @Cancelled
  , @Currency
  , @CurrencyRate
  , @CurrencyUnit
  , @CustomerName
  , @CustomerNumber
  , @DocumentNumber
  , @DueDate
  , @ExternalInvoiceReference1
  , @ExternalInvoiceReference2
  , @InvoiceDate
  , @NoxFinans
  , @OCR
  , @WayOfDelivery
  , @TermsOfPayment
  , @Project
  , @Sent
  , @Total
  );
