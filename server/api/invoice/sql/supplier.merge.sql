/*
Slowly Changing Dimensions for the Supplier table.
This merges from TempSupplier into Supplier,
and upon change disables the old row and inserts a new row.
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
SELECT
    [@url]
  , [City]
  , [Email]
  , [Name]
  , [OrganisationNumber]
  , [Phone]
  , [SupplierNumber]
  , [ZipCode]
FROM (
  MERGE [dbo].[Supplier] AS [Target]
  USING [dbo].[TempSupplier] AS [Source]
    ON [Target].SupplierNumber = [Source].SupplierNumber
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[City] != [Source].[City]
   OR [Target].[Email] != [Source].[Email]
   OR [Target].[Name] != [Source].[Name]
   OR [Target].[OrganisationNumber] != [Source].[OrganisationNumber]
   OR [Target].[Phone] != [Source].[Phone]
   OR [Target].[SupplierNumber] != [Source].[SupplierNumber]
   OR [Target].[ZipCode] != [Source].[ZipCode]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [@url]
      , [City]
      , [Email]
      , [Name]
      , [OrganisationNumber]
      , [Phone]
      , [SupplierNumber]
      , [ZipCode]
    ) VALUES (
        [Source].[@url]
      , [Source].[City]
      , [Source].[Email]
      , [Source].[Name]
      , [Source].[OrganisationNumber]
      , [Source].[Phone]
      , [Source].[SupplierNumber]
      , [Source].[ZipCode]
    )
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [SupplierNumber] IS NOT NULL
;