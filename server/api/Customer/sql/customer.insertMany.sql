/*
Inserts many rows into the Custome table.
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
VALUES {{ query_placeholder }};