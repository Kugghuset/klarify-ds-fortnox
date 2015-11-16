/*
On start, create the Account table if it's not present.
*/

IF (OBJECT_ID('TempAccount', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TempAccount] (
    [@url] nvarchar(max) NULL,
    [Active]  bit NULL DEFAULT 1,
    [BalanceBroughtForward] DECIMAL (18, 2) NOT NULL,
    [BalanceCarriedForward] DECIMAL (18, 2) NULL,
    [CostCenter] nvarchar(max) NULL,
    [CostCenterSettings] (max) NULL,
    [Description] nvarchar(200) NULL,
    [Number] smallint(4) NULL,
    [Project] int NULL,
    [ProjectSettings] nvarchar(max) NULL,
    [SRU] smallint(4,5) NULL,
    [TransactionInformation] nvarchar(100),
    [TransactionInformationSettings] nvarchar(max),
    [VATCode] nvarchar(max) NULL,
    [Year] int NULL 
  )
END
