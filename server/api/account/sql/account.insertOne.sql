/*
Inserts one Account into the Account table.
*/

INSERT INTO [dbo].[Account] (
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
