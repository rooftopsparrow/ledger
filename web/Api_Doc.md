## Update Password

```go
URL:
localhost:8080/changepassword

Authorization Bearer Token : <Auth Token>

Form-Data :
currentPassword:<Password>
newPassword:<Updated Password>

Response :
Password Updated Successfully

```
### Update Profile

```go
URL:
localhost:8080/update_profile

Authorization Bearer Token : <Auth Token>

Form-Data :
email: test@gmail.com
name: Updated Test Name

Response :
{
    "FullName":"test@gmail.com",
    "Email":"Updated Test Name",
    "CreatedAt":"2021-04-19T08:59:59.485+00:00",
    "UpdatedAt":"2021-04-19T08:59:59.485+00:00",
    "DeletedAt":"2021-04-19T08:59:59.485+00:00"
}

```
