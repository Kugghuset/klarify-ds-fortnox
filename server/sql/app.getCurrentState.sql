/*
Gets the current state of the application.
*/

SELECT TOP 1 [StateID], [DateUpdated] FROM [dbo].[{{ table_name }}] ORDER BY [StateID] DESC;
