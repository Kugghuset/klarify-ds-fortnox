/*
Inserts one Supplier into the Voucher table.
*/

INSERT INTO [dbo].[Voucher] (
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
