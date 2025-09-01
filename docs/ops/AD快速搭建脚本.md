### AD快速搭建脚本

#### 1. sysprep预处理

管理员powershell执行如下命令

这个步骤会将克隆的winserver虚拟机执行sysprep，执行后会关机（这个步骤将会清理个人用户数据！！！）

```powershell
C:\Windows\System32\Sysprep\sysprep.exe /generalize /oobe /shutdown
```

#### 2. 准备工作

手动开机后，重新配置一下账号密码和静态ip

#### 3. 执行脚本

将下面内容保存为ps1脚本，分3步骤执行

```powershell
# 改名。重启计算机
Rename-Computer -NewName "adserver" -Force -PassThru
restart-computer



#增加 AD 配置，重启计算机

# 域名
$VDI_DomainName = "DC=vdi,DC=cloud"


$DomainNetBiosName = "vdi"

Install-WindowsFeature AD-Domain-Services -IncludeManagementTools

Install-ADDSForest -DomainName vdi.cloud -SafeModeAdministratorPassword (ConvertTo-SecureString 'abc@2020' -AsPlainText -Force) -DomainMode WinThreshold -DomainNetbiosName $DomainNetBiosName -ForestMode WinThreshold -DatabasePath "C:\Windows\NTDS" -LogPath "C:\Windows\NTDS" -SysvolPath "C:\Windows\SYSVOL" -CreateDnsDelegation:$false -InstallDns:$true -NoRebootOnCompletion:$true -Force:$true

restart-computer



# 添加用户账号，群组账号

$VDI_DomainName = "DC=vdi,DC=cloud"
$DomainNetBiosName = "vdi"

$VDI_OrganizationalUnit = "vdiCloud"
$VDI_ADGroup = "VDI Users"
$VDI_TestUserPrifx = "user"
$VDI_TestUserNum = 10
$VDI_TestUserPassword = "abc@2020"
$VDI_Path = "OU=" + $VDI_OrganizationalUnit +"," + $VDI_DomainName
$VDI_Path
$VDI_Department_ADGroup = "Design Department"
#创建一个组织单位
New-ADOrganizationalUnit -Name $VDI_OrganizationalUnit -Path $VDI_DomainName
#创建一个VDI大群组
New-ADGroup -Name $VDI_ADGroup -GroupScope Global -Path $VDI_Path -Description "Group for permissions to VDI"
#创建某个部门群组
New-ADGroup -Name $VDI_Department_ADGroup -GroupScope Global -Path $VDI_Path -Description "Group for Department"
#部门群组属于 VDI 大群组
Add-ADGroupMember $VDI_ADGroup $VDI_Department_ADGroup
for ($index=1; $index -le $VDI_TestUserNum; $index++)
{
    $username = $VDI_TestUserPrifx + ($index).ToString('00')
    $upn = $username + "@vdi.cloud"
    $userDisplayName = $username + " for VDI test";
    # 创建用户
    New-ADUser `
     -Name $username `
     -Path $VDI_Path `
     -SamAccountName $username `
     -userPrincipalName $upn `
     -DisplayName $userDisplayName `
     -AccountPassword (ConvertTo-SecureString $VDI_TestUserPassword -AsPlainText -Force) `
     -ChangePasswordAtLogon $false `
     -Enabled $true
     # 将用户增加到部门群组，不要直接增加到 VDI 大群组
     Add-ADGroupMember $VDI_Department_ADGroup $username
}

```

