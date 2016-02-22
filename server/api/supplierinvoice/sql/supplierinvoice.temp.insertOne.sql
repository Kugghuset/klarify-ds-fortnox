/*
Inserts one SupplierInvoice into the TempSupplierInvoice table.
*/

INSERT INTO [dbo].[TempSupplierInvoice] (
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
    )
VALUES (
    @url
  , @Balance
  , @Booked
  , @Cancel
  , @DueDate
  , @GivenNumber
  , @InvoiceDate
  , @InvoiceNumber
  , @SupplierNumber
  , @SupplierName
  , @Total
  );
