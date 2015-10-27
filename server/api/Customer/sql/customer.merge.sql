/*
Merges the TempCustomer table into the Customer table.
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
  , [IsDisabled]
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
  , [IsDisabled]
FROM (
  MERGE [dbo].[Customer] AS [Target]
  USING [dbo].[TempCustomer] AS [Source]
    ON [Target].CustomerNumber = [Source].CustomerNumber
    AND [Target].IsCurrent = 1
  WHEN MATCHED
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
      , [IsDisabled] = 1
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [CustomerNumber] IS NOT NULL
;