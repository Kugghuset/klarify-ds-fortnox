/*
Inserts one Supplier into the Supplier table.
*/

INSERT INTO [dbo].[Supplier] (
        [@url]
      , [City]
      , [Email]
      , [Name]
      , [OrganisationNumber]
      , [Phone]
      , [SupplierNumber]
      , [ZipCode]
    )
VALUES (
    @url
  , @City
  , @Email
  , @Name
  , @OrganisationNumber
  , @Phone
  , @SupplierNumber
  , @ZipCode
  );
