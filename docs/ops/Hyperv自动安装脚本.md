# Hyperv自动安装脚本

将以下内容保存为ps1脚本，右键使用powershell运行两次

```powershell
#安装 Hyper-V 角色和Hyper-V管理工具，并自动重启

Write-Host "安装 Windows Server的Hyper-V角色" 
Install-WindowsFeature -Name Hyper-v -IncludeManagementTools -Restart

Write-Host "    Windows Server的Hyper-V角色已经安装`n" 

#启用服务器的远程桌面服务（RDP服务），并允许RDP通过防火墙。
Write-Host "启用远程桌面服务（RDP服务）" 
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server'-name "fDenyTSConnections" -Value 0

Write-Host "    开启RDP（3389端口）的防火墙" 
Enable-NetFirewallRule -DisplayGroup "远程桌面"
$cul = Get-Culture
if ($cul.Name -eq "en_US") 
{ 
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
}
if ($cul.Name -eq "zh_CN") 
{ 
    Enable-NetFirewallRule -DisplayGroup "远程桌面"
}

Write-Host "    启用网络级安全认证（NLA）`n" 
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "UserAuthentication" -Value 1

#把 Hyper-V Manager 的快捷方式增加到桌面
Write-Host "在桌面创建 Hyper-V Manager 的快捷方式`n" 
copy "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Administrative Tools\Hyper*.lnk" "c:\Users\$env:UserName\Desktop" -Recurse -Force

#配置Windows更新为自动下周，手工启用。
Write-Host "配置Windows更新为自动下周，手工启用`n" 
$WUSettings = (New-Object -com "Microsoft.Update.AutoUpdate").Settings
$WUSettings.NotificationLevel=3
$WUSettings.save()


Write-Host "禁用浏览器的增强安全特性`n" 
function Disable-InternetExplorerESC {
    $AdminKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}"
    $UserKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}"
    Set-ItemProperty -Path $AdminKey -Name "IsInstalled" -Value 0
    Set-ItemProperty -Path $UserKey -Name "IsInstalled" -Value 0
    Stop-Process -Name Explorer
#    Write-Host "IE Enhanced Security Configuration (ESC) has been disabled." -ForegroundColor Green
}
Disable-InternetExplorerESC

Write-Host "启用vGPU功能`n" 
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows" -Name HyperV
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\HyperV" -Name "RequireSecureDeviceAssignment" -Type DWORD -Value 0 -Force
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\HyperV" -Name "RequireSupportedDeviceAssignment" -Type DWORD -Value 0 -Force

Write-Host "Windows Server已经配置完毕，可以开始 Deskpool 桌面虚拟化管理系统的安装`n"
```
