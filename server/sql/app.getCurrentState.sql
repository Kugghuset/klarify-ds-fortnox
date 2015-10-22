/*
Gets the current state of the application.
*/

SELECT TOP 1 StateID, CustomerDateUpdated FROM dbo.StateFortnox ORDER BY StateID DESC;
