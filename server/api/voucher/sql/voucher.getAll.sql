/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
       [VoucherID]
     , [@url]
     , [ReferenceNumber]
     , [ReferenceType]
     , [VoucherNumber]
     , [VoucherSeries]
     , [Year]
     , [IsCurrent]
  FROM [dbo].[Voucher];

  ELSE
    SELECT
       [VoucherID]
     , [@url]
     , [ReferenceNumber]
     , [ReferenceType]
     , [VoucherNumber]
     , [VoucherSeries]
     , [Year]
     , [IsCurrent]
  FROM [dbo].[Voucher];