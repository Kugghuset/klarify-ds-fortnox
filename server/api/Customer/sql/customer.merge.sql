/*
Slowly Changing Dimensions for the Customer table.
This merges from TempCustomer into Customer,
and upon change disables the old row and inserts a new row.
*/


INSERT INTO [dbo].[Customer] (
    [@url]
  , [Address1]
  , [Address2]
  , [City]
  , [CustomerNumber]
  , [Email]
  , [Name]
  , [OrganisationNumber]
  , [Phone]
  , [ZipCode]
  )
SELECT
    [@url]
  , [Address1]
  , [Address2]
  , [City]
  , [CustomerNumber]
  , [Email]
  , [Name]
  , [OrganisationNumber]
  , [Phone]
  , [ZipCode]
FROM (
  MERGE [dbo].[Customer] AS [Target]
  USING [dbo].[TempCustomer] AS [Source]
    ON [Target].CustomerNumber = [Source].CustomerNumber
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Address1] != [Source].[Address1]
   OR [Target].[Address2] != [Source].[Address2]
   OR [Target].[City] != [Source].[City]
   OR [Target].[CustomerNumber] != [Source].[CustomerNumber]
   OR [Target].[Email] != [Source].[Email]
   OR [Target].[Name] != [Source].[Name]
   OR [Target].[OrganisationNumber] != [Source].[OrganisationNumber]
   OR [Target].[Phone] != [Source].[Phone]
   OR [Target].[ZipCode] != [Source].[ZipCode]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [@url]
      , [Address1]
      , [Address2]
      , [City]
      , [CustomerNumber]
      , [Email]
      , [Name]
      , [OrganisationNumber]
      , [Phone]
      , [ZipCode]
    ) VALUES (
        [Source].[@url]
      , [Source].[Address1]
      , [Source].[Address2]
      , [Source].[City]
      , [Source].[CustomerNumber]
      , [Source].[Email]
      , [Source].[Name]
      , [Source].[OrganisationNumber]
      , [Source].[Phone]
      , [Source].[ZipCode]
    )
  WHEN NOT MATCHED BY SOURCE AND [Target].[IsCurrent] = 1
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [CustomerNumber] IS NOT NULL
;