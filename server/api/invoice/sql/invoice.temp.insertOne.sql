/*
Inserts one Invoice into the TempInvoice table.
*/

INSERT INTO [dbo].[TempInvoice] (
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
