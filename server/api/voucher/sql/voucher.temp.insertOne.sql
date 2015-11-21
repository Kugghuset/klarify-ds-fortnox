/*
Inserts one Voucher into the TempVoucher table.
*/

INSERT INTO [dbo].[TempVoucher] (
        [@url]
      , [ReferenceNumber]
      , [ReferenceType]
      , [VoucherNumber]
      , [VoucherSeries]
      , [Year]
    )
VALUES (
    @url
  , @ReferenceNumber
  , @ReferenceType
  , @VoucherNumber
  , @VoucherSeries
  , @Year
  );
