/*
Inserts one Customer into the Customer table.
*/

INSERT INTO Customer (
      [@url]
    , Address1
    , Address2
    , City
    , CustomerNumber
    , Email
    , [Name]
    , OrganisationNumber
    , Phone
    , ZipCode
    )
VALUES (
    @url
  , @address1
  , @address2
  , @city
  , @customerNumber
  , @email
  , @name
  , @organisationNumber
  , @phone
  , @zipCode
  );
