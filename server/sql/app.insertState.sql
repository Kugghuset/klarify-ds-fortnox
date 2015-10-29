/*
Inserts a new {{ table_name }} row with the current UTC date in DateUpdated.
*/

INSERT INTO [dbo].[{{ table_name }}] (
    [DateUpdated]
  , [UpdateMethod]
)
VALUES (
  GETUTCDATE(),
  @updateMethod
);
