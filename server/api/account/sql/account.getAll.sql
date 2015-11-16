/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
        [AccountID]
      , [@url]
      , [Active]
      , [BalanceBroughtForward]
      , [BalanceCarriedForward]
      , [CostCenter]
      , [CostCenterSettings]
      , [Description]
      , [Number]
      , [Project]
      , [ProjectSettings]
      , [SRU]
      , [TransactionInformation]
      , [TransactionInformationSettings]
      , [VATCode]
      , [Year]
  FROM [dbo].[Account];

  ELSE
    SELECT
       [AccountID]
             , [@url]
             , [Active]
             , [BalanceBroughtForward]
             , [BalanceCarriedForward]
             , [CostCenter]
             , [CostCenterSettings]
             , [Description]
             , [Number]
             , [Project]
             , [ProjectSettings]
             , [SRU]
             , [TransactionInformation]
             , [TransactionInformationSettings]
             , [VATCode]
             , [Year]
  FROM [dbo].[Account];
