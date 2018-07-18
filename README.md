## Envoy Carwash

## UI Admin Configuration

#### Part A

1.  Go into the [Flamelink](https://app.flamelink.io/dashboard) account and create a new admin user. Be sure to use same email they will use for the UI App login

#### Part B

1.  Locate the `admins.json` file at the roote of the project
2.  Add the new admin's jweimer, be sure it matches the email they will use to login, to the JSON file
3.  Save the file and head to the projects Firebase console
4.  Go to database -> data -> admins
5.  Click the ellipsis, and then click 'Import JSON'
6.  Upload the JSON file from Part B, Step 1
