# Envoy Carwash

[Application](www.envoycarwash.netlify.com)

## UI Admin Configuration

#### Part A

1.  Go into the [Flamelink](https://app.flamelink.io/dashboard) account and create a new admin user. Be sure to use same email they will use for the UI App login

#### Part B

1.  Locate the `admins.json` file at the root of the project
2.  Add the new admin's email to the JSON file, save the file. Be sure the email matches what they will use to login
3.  Head to the project's Firebase [console](http://console.firebase.google.com/)
4.  Go to database -> data -> admins
5.  Click the ellipsis, and then click 'Import JSON'
6.  Upload the JSON file from Part B, Step 1

## Development

For local development, recah out to Jeff Weimer and get a copy of the `.env.local` file needed to connect to the Firebase API.
