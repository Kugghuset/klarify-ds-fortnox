/*
Inserts one Voucherseries into the TempVoucherseries table.
*/

INSERT INTO [dbo].[TempVoucherseries] (
      , [@url]
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