## Getting Started

**Clone the Github Repository**

The repo can be found at [scouting-app-rn](https://github.com/FairportRobotics/scouting-app-rn)

**Install Dependencies**

Once the repo is cloned, open a terminal to the folder containing the source an execute the following to install all the dependencies we will need.

```
npm install
```

We only need to do this one time.

## Running the Project

In order to debug and see the application, we need to install the "Expo Go" app on your iOS device. The iPads will have this installed already, but if you want to test on a personal device, you will need the app.

**Run the Project**

Open a terminal to the folder containing the source and execute the following command:

```
npm start
```

This will load a launcher that can be used to refresh the app, connect to simulators and provides a QR code which can be used to load the application into Expo Go.

The easiest thing to do is scan the QR code and allow Expo Go to open the application. The application should open.

If there are ever any issues, shake the device to bring up the debug menu and select "Reload". This will refresh the application code on the device.

Any changes made to code should immediately be deployed and available on the device making development very nice.

**Prebuild**

```
npx expo prebuild
```

**Expo Deploy**

```
eas update --branch <desired name of branch> --message "<some message>"
```

## Setup

### Github

The repo is named `scouting-app-rn` and the repository name is [scouting-app-rn](https://github.com/FairportRobotics/scouting-app-rn).

### Expo

I created an Expo Dev account using

scouting@fairportrobotics.org
scouting.fairportrobotics
(same password as Apple ID for now)

I then created a new organization as this seems to be required in order to connect Expo to Github.

From the source code folder, I ran the following commands to bind the repository to Expo:

```
npm install --global eas-cli
eas init --id a90a99f4-e77c-475d-9318-74c9c62a3396
```

Once that was completed, I kicked off a build and publish with:

```
eas update --branch <name-of-branch> --message "Some message"
```

## Resources and Technologies

**Icons**

Using [FontAwesome](https://fontawesome.com/search?o=r&m=free) for icons as SVGs in React Native are not trivial.

**Expo**

**Axios**
https://axios-http.com/docs/intro

**Azure REST**
Unable to use the Azure SDK dues to unresolved issues with an incompatible library that cannot be patched. Expo doctor still complains. So, I've found a solution that uses REST. It's bare-bones but it works.

Azure REST API Documentation:
https://learn.microsoft.com/en-us/rest/api/cosmos-db/list-documents

Headers:
https://learn.microsoft.com/en-us/rest/api/cosmos-db/common-cosmosdb-rest-request-headers

Auth token:
https://learn.microsoft.com/en-us/rest/api/cosmos-db/access-control-on-cosmosdb-resources?redirectedfrom=MSDN

Stolen shamelessly from:
https://github.com/blazerroadg/react-native-azure-cosmos/blob/master/headers.js

https://devblogs.microsoft.com/cosmosdb/announcing-javascript-sdk-v4/

## Todo

[ ] Prevent moving from Confirm screen without entering the scouter name for both Done and tapping the navigation.

[ ] Pre-populate the Scouter Name by taking name the last saved Match.
