/*
Inserts one Supplier into the TempSupplier table.
*/

INSERT INTO [dbo].[TempSupplier] (
      , [@url]
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
  , @city
  , @Email
  , @Name
  , @OrganisationNumber
  , @Phone
  , @SupplierNumber
  , @ZipCode
  );


