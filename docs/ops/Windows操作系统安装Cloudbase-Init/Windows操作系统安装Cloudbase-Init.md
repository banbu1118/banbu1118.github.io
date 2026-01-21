## Windows操作系统安装Cloudbase-Init

### 一、简介

通过cloudbase-init，可以快速配置虚拟机的用户信息，ip信息等配置

参考资料：

[https://www.riv3n.com/2025/10/28/PVE-Windows-Cloudbase-init/](https://www.riv3n.com/2025/10/28/PVE-Windows-Cloudbase-init/)

[https://www.tcps.cc/posts/pve-windows-cloudinit-guide](https://www.tcps.cc/posts/pve-windows-cloudinit-guide)

### 二、下载

GitHub仓库release下载：[https://github.com/cloudbase/cloudbase-init/releases](https://github.com/cloudbase/cloudbase-init/releases)

注意：win7和win server 2008 R2请安装 Cloudbase-Init 1.1.2版本。

如使用1.1.4及以上版本，将出现“无法启动此程序，因为计算机中丢失 api-ms-win-core-path-l1-1-0.dll”报错。

### 三、安装

前面默认，这里用户名输入虚拟机的管理员用户administrator，串口没有就跳过，不要勾选Run Cloudbase-init service as LocalSystem

![](./images/1.png)

安装完成不要勾选最后两个

![](./images/2.png)

### 四、配置文件

编辑“C:\Program Files\Cloudbase Solutions\Cloudbase-Init\conf\cloudbase-init.conf”，清空后，替换为以下内容，保存后关机

```
[DEFAULT]
username=administrator
groups=Administrators
inject_user_password=true
first_logon_behaviour=no
rename_admin_user=true
bsdtar_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\bin\bsdtar.exe
mtools_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\bin\
verbose=true
debug=true
log_dir=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\log\
log_file=cloudbase-init.log
default_log_levels=comtypes=INFO,suds=INFO,iso8601=WARN,requests=WARN
mtu_use_dhcp_config=false
ntp_use_dhcp_config=false
local_scripts_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\LocalScripts\
check_latest_version=false
metadata_services=cloudbaseinit.metadata.services.configdrive.ConfigDriveService
plugins=cloudbaseinit.plugins.common.networkconfig.NetworkConfigPlugin,cloudbaseinit.plugins.windows.extendvolumes.ExtendVolumesPlugin,cloudbaseinit.plugins.common.setuserpassword.SetUserPasswordPlugin,cloudbaseinit.plugins.common.sethostname.SetHostNamePlugin,cloudbaseinit.plugins.windows.createuser.CreateUserPlugin
[config_drive]
cdrom=true
```

### 五、添加cloudinit设备

![](./images/3.png)

### 六、应用cloud-init

编辑cloud-init配置，用户为安装时的Administrator，密码可以自定义，ip和ip可以自定义，编辑后点击右上角的重生成镜像，开机后即可生效

![](./images/4.png)

### 七、测试验证


测试了win7，win10，win11，server2019，server2025可以正常使用

### 八、卸载config-2驱动器

编辑“C:\Program Files\Cloudbase Solutions\Cloudbase-Init\Python\Lib\site-packages\cloudbaseinit\metadata\services\configdrive.py”，清空后，替换为以下内容

这个脚本在 win10、win11 测试通过，win7不通过

```py
# Copyright 2020 Cloudbase Solutions Srl
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

from oslo_log import log as oslo_logging
from cloudbaseinit import conf as cloudbaseinit_conf
from cloudbaseinit.metadata.services import baseconfigdrive
from cloudbaseinit.metadata.services import baseopenstackservice
import os
import shutil
import ctypes

CONF = cloudbaseinit_conf.CONF
LOG = oslo_logging.getLogger(__name__)


class ConfigDriveService(baseconfigdrive.BaseConfigDriveService,
                         baseopenstackservice.BaseOpenStackService):

    def __init__(self):
        super(ConfigDriveService, self).__init__(
            'config-2', 'openstack\\latest\\meta_data.json')

    def cleanup(self):
        LOG.debug('Deleting metadata folder: %r', self._mgr.target_path)
        shutil.rmtree(self._mgr.target_path, ignore_errors=True)
        self._metadata_path = None

        # 动态获取 config-2 驱动器的盘符
        drive_letter = self._get_config_drive_letter()

        if drive_letter:
            LOG.debug('Found config-2 drive at: %s', drive_letter)
            success = self._eject_drive(drive_letter)
            if success:
                LOG.info('Successfully ejected config-2 drive: %s', drive_letter)
            else:
                LOG.warning('Failed to eject config-2 drive: %s', drive_letter)
        else:
            LOG.warning('No config-2 drive found to eject')

    def _get_config_drive_letter(self):
        """动态获取 config-2 驱动器的盘符，优先使用现代方法，兼容旧系统"""

        # 方法1：现代 PowerShell CIM 方法 (Windows Server 2016+)
        try:
            LOG.debug('Attempting to find config-2 drive using PowerShell CIM')
            ps_cmd = 'powershell "Get-CimInstance -ClassName Win32_LogicalDisk | Where-Object {$_.VolumeName -eq \'config-2\'} | Select-Object -ExpandProperty DeviceID"'
            result = os.popen(ps_cmd).read().strip()

            if result and ':' in result:
                LOG.debug('Found drive using PowerShell CIM: %s', result)
                return result
        except Exception as e:
            LOG.debug('PowerShell CIM method failed: %s', e)

        # 方法2：兼容旧系统的 wmic 方法 (Windows Server 2012/2019)
        try:
            LOG.debug('Attempting to find config-2 drive using wmic (legacy)')
            result = os.popen('wmic logicaldisk where VolumeName="config-2" get Caption | findstr /I ":"').read().strip()

            if result and ':' in result:
                LOG.debug('Found drive using wmic: %s', result)
                return result
        except Exception as e:
            LOG.debug('WMIC method failed: %s', e)

        # 方法3：PowerShell WMI 方法 (中等兼容性)
        try:
            LOG.debug('Attempting to find config-2 drive using PowerShell WMI')
            ps_cmd = 'powershell "Get-WmiObject -Class Win32_LogicalDisk | Where-Object {$_.VolumeName -eq \'config-2\'} | Select-Object -ExpandProperty DeviceID"'
            result = os.popen(ps_cmd).read().strip()

            if result and ':' in result:
                LOG.debug('Found drive using PowerShell WMI: %s', result)
                return result
        except Exception as e:
            LOG.debug('PowerShell WMI method failed: %s', e)

        LOG.warning('All methods failed to find config-2 drive')
        return None

    def _eject_drive(self, drive_letter):
        """弹出指定的驱动器，优先使用现代方法，兼容旧系统"""

        # 方法1：PowerShell Shell.Application（已验证可行，Windows Server 2016+）
        try:
            LOG.debug('Attempting PowerShell Shell.Application eject for: %s', drive_letter)
            ps_cmd = f'powershell "(New-Object -comObject Shell.Application).Namespace(17).ParseName(\'{drive_letter}\').InvokeVerb(\'Eject\')"'
            result = os.system(ps_cmd)

            if result == 0:
                LOG.info('Successfully ejected %s using PowerShell Shell.Application', drive_letter)
                return True
            else:
                LOG.debug('PowerShell Shell.Application eject failed with code: %d', result)
        except Exception as e:
            LOG.debug('PowerShell Shell.Application eject exception: %s', e)

        # 方法2：传统 MCI 命令（兼容旧系统，Windows Server 2012/2019）
        try:
            LOG.debug('Attempting MCI eject for: %s (legacy compatibility)', drive_letter)
            result1 = ctypes.windll.WINMM.mciSendStringW(f"open {drive_letter} type cdaudio alias d_drive", None, 0, None)
            result2 = ctypes.windll.WINMM.mciSendStringW("set d_drive door open", None, 0, None)
            result3 = ctypes.windll.WINMM.mciSendStringW("close d_drive", None, 0, None)

            LOG.debug('MCI eject results: open=%d, eject=%d, close=%d', result1, result2, result3)

            if result1 == 0 and result2 == 0:
                LOG.info('Successfully ejected %s using MCI (legacy method)', drive_letter)
                return True
            else:
                LOG.debug('MCI eject failed: open=%d, eject=%d', result1, result2)
        except Exception as e:
            LOG.debug('MCI eject exception: %s', e)

        # 方法3：PowerShell WMI 卸载方法（中等兼容性）
        try:
            LOG.debug('Attempting PowerShell WMI dismount for: %s', drive_letter)
            ps_cmd = f'powershell "(Get-WmiObject -Class Win32_Volume | Where-Object {{$_.DriveLetter -eq \'{drive_letter}\'}}).Dismount($true, $false)"'
            result = os.system(ps_cmd)

            if result == 0:
                LOG.info('Successfully dismounted %s using PowerShell WMI', drive_letter)
                return True
            else:
                LOG.debug('PowerShell WMI dismount failed with code: %d', result)
        except Exception as e:
            LOG.debug('PowerShell WMI dismount exception: %s', e)

        LOG.error('All eject methods failed for drive: %s', drive_letter)
        LOG.info('Please manually eject the drive from Windows Explorer if needed')
        return False
```
