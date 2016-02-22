/*
Inserts one Costcenter into the TempCostcenter table.
*/

INSERT INTO [dbo].[TempCostcenter] (
      , [@url]
      , [Code]
      , [Description]
      , [Note]
      , [Active]
    )
VALUES (
    @url
  , @Code
  , @Description
  , @Note
  , @Active
  );