/*
Inserts one Account into the TempAccount table.
*/

INSERT INTO [dbo].[TempAccount] (
      [@url]
    , [active]
    , [Description]
    , [Number]
    , [SRU]
    , [Year]
    )
VALUES (
    @url
  , @active
  , @Description
  , @Number
  , @SRU
  , @Year
  );
