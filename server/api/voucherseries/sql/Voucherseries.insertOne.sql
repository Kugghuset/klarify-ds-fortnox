/*
Inserts one Supplier into the Voucherseries table.
*/

INSERT INTO [dbo].[Voucherseries] (
        [@url]
      , [Code]
      , [Description]
      , [Manual]
      , [NextVoucherNumber]
      , [Year]
    )
VALUES (
    @url
  , @Code
  , @Description
  , @Manual
  , @NextVoucherNumber
  , @Year
  );
