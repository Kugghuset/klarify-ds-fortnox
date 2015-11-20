/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
        [VoucherseriesID]
      , [@url]
      , [Code]
      , [Description]
      , [Manual]
      , [NextVoucherNumber]
      , [Year]
      , [IsCurrent]
  FROM [dbo].[Voucherseries];

  ELSE
    SELECT
        [VoucherseriesID]
       , [@url]
       , [Code]
       , [Description]
       , [Manual]
       , [NextVoucherNumber]
       , [Year]
       , [IsCurrent]
  FROM [dbo].[Voucherseries];