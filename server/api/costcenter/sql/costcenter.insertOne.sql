/*
Inserts one Supplier into the Costcenter table.
*/

INSERT INTO [dbo].[Costcenter] (
        [@url]
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
