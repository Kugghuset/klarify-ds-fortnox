/*
Inserts bulk Account into the Account table.
*/

BULK INSERT INTO [dbo].[Account] (
      [@url]
    , [active]
    , [Description]
    , [Number]
    , [SRU]
    , [Year]
    )
VALUES ?;
