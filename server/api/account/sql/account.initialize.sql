/*
On start, create the Account table if it's not present.
*/

IF (OBJECT_ID('Account', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Account] (
    [AccountID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [@url] nvarchar(max) NULL,
    [Active]  bit NULL DEFAULT 1,
    [BalanceBroughtForward] DECIMAL (18, 2) NOT NULL,
    [BalanceCarriedForward] DECIMAL (18, 2) NULL,
    [CostCenter] nvarchar(max) NULL,
    [CostCenterSettings] nvarchar(max) NULL,
    [Description] nvarchar(200) NULL,
    [Number] int NULL,
    [Project] int NULL,
    [ProjectSettings] nvarchar(max) NULL,
    [SRU] int NULL,
    [TransactionInformation] nvarchar(100) NULL,
    [TransactionInformationSettings] nvarchar(max) NULL,
    [VATCode] nvarchar(max) NULL,
    [Year] int NULL
  )
END
