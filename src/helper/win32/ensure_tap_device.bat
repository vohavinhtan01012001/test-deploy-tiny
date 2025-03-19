:: Copyright 2018 The Outline Authors
::
:: Licensed under the Apache License, Version 2.0 (the "License");
:: you may not use this file except in compliance with the License.
:: You may obtain a copy of the License at
::
::      http://www.apache.org/licenses/LICENSE-2.0
::
:: Unless required by applicable law or agreed to in writing, software
:: distributed under the License is distributed on an "AS IS" BASIS,
:: WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
:: See the License for the specific language governing permissions and
:: limitations under the License.

::Fix tuntap --> https://www.reddit.com/r/SCCM/comments/b0yj3h/trying_to_install_tap_driver_by_stripping_off/
@echo off
setlocal

set TAP_WINDOWS_PATH=%1

set PATH=%PATH%;%SystemRoot%\system32;%SystemRoot%\system32\wbem;%SystemRoot%\system32\WindowsPowerShell/v1.0

echo Creating TAP network device...
for /f "tokens=4 delims=[.] " %%i in ('ver') do (
  if %%i==10 %TAP_WINDOWS_PATH%\tap-windows-9.24.2-I601-Win10.exe certuril -addstore "TrustedPublisher" trustcer.cert /S /SELECT_SHURTCUTS=0 /SELECT_OPENVPN=0 /SELECT_SERVICE=0 /SELECT_TAP=1 /SELECT_OPENVPNGUI=0 /SELECT_ASSOCIATIONS=0
  if %%i==6 %TAP_WINDOWS_PATH%\tap-windows-9.9.2_3.exe certuril -addstore "TrustedPublisher" trustcer.cert /S /SELECT_SHURTCUTS=0 /SELECT_OPENVPN=0 /SELECT_SERVICE=0 /SELECT_TAP=1 /SELECT_OPENVPNGUI=0 /SELECT_ASSOCIATIONS=0
)
if %errorlevel% neq 0 (
  echo Could not create TAP network device. >&2
  exit /b 1
)


echo TAP network device added successfully.
exit /b 0
