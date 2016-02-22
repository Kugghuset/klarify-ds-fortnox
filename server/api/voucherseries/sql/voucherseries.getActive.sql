/*
Gets all active voucherseries from the database.
*/

SELECT
      [VoucherseriesID]
     , [@url]
     , [Code]
     , [Description]
     , [Manual]
     , [NextVoucherNumber]
     , [Year]
     , [IsCurrent]
FROM [dbo].[Voucherseries]
WHERE [IsCurrent] = 1;