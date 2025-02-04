$acl = Get-Acl -Path ".\conf" # Get the current ACL of the config directory

# Grant Full Control to Everyone (use with caution in production!)
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Everyone","FullControl","Allow")
$acl.SetAccessRule($accessRule)

# Apply the new ACL to the directory and its subdirectories
Set-Acl -Path ".\conf" -AclObject $acl -Recurse