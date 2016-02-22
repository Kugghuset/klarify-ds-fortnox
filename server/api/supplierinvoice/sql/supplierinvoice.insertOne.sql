/*
Inserts one SupplierInvoice into the SupplierInvoice table.
*/

INSERT INTO [dbo].[SupplierInvoice] (
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
