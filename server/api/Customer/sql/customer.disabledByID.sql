/*
Sets a Customer to disabled.
*/

UPDATE dbo.Customer
SET Customer.IsDisabled = 1
Where CustomerID = @customerID;
