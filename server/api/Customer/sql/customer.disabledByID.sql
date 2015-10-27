/*
Sets a Customer to disabled.
*/

UPDATE [dbo].[Customer]
SET
    [Customer].[IsCurrent] = 1
  , [Customer].[EndDate] = GETUTCDATE()
  , [Customer].[LastUpdated] = GETUTCDATE()
Where [CustomerID] = @customerID;
