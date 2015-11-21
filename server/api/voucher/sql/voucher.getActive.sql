/*
Gets all active vouchers from the database.
*/

SELECT
      [VoucherID]
     , [@url]
     , [ReferenceNumber]
     , [ReferenceType]
     , [VoucherNumber]
     , [VoucherSeries]
     , [Year]
     , [IsCurrent]
FROM [dbo].[Voucher]
WHERE [IsCurrent] = 1;