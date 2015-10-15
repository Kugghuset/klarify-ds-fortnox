-- Customer schema

IF (OBJECT_ID('Customer', 'U') IS NULL)
BEGIN
  CREATE TABLE Customer (
    CustomerId bigint IDENTITY(1, 1) PRIMARY KEY,
    [@url] nvarchar(max),
    Address1 nvarchar(1024),
    Address2 nvarchar(1024),
    City nvarchar(1024),
    CustomerNumber nvarchar(1024),
    Email nvarchar(1024),
    Name nvarchar(1024),
    OrganisationNumber nvarchar(30),
    Phone nvarchar(1024),
    ZipCode  nvarchar(10)
  )
END
