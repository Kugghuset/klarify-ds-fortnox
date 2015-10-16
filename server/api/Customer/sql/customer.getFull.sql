/*
Gets the top @topNum entries
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
        CustomerID
      , [@url]
      , Address1
      , Address2
      , City
      , CustomerNumber
      , Email
      , [Name]
      , OrganisationNumber
      , Phone
      , ZipCode
  FROM Customer

  ELSE
    SELECT
        CustomerID
      , [@url]
      , Address1
      , Address2
      , City
      , CustomerNumber
      , Email
      , [Name]
      , OrganisationNumber
      , Phone
      , ZipCode
  FROM Customer;
