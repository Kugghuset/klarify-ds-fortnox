-- Customer schema

/* Do something with these
 "@url",
  "Address1",
  "Address2",
  "City",
  "CustomerNumber",
  "Email",
  "Name",
  "OrganisationNumber",
  "Phone",
  "ZipCode"
*/

IF (OBJECT_ID('Customer', 'U') IS NULL)
BEGIN
  CREATE TABLE Customer (
    CustomerId bigint IDENTITY(1, 1) PRIMARY KEY
  )
END