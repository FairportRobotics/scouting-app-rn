## Getting Started

**Clone the Github Repository**

The repo can be found at [scouting-app-rn](https://github.com/FairportRobotics/scouting-app-rn)

**Install Dependencies**

Once the repo is cloned, open a terminal to the folder containing the source an execute the following to install all the dependencies we will need.

```
npm install
```

We only need to do this one time.

**Install the Expo CLI**

Expo is the tool used to transpile the React Code into iOS and Android.

```
npm install -g expo-cli
```

We only need to do this one time.

## Running the Project

In order to debug and see the application, we need to install the "Expo Go" app on your iOS device. The iPads will have this installed already, but if you want to test on a personal device, you will need the app.

**Run the Project**

Open a terminal to the folder containing the source and execute the following command:

```
npm expo start
```

This will load a launcher that can be used to refresh the app, connect to simulators and provides a QR code which can be used to load the application into Expo Go.

The easiest thing to do is scan the QR code and allow Expo Go to open the application. The application should open.

If there are ever any issues, shake the device to bring up the debug menu and select "Reload". This will refresh the application code on the device.

Any changes made to code should immediately be deployed and available on the device making development very nice.

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
eas update
```

## Resources and Technologies

**Icons**

Using [FontAwesome](https://fontawesome.com/search?o=r&m=free) for icons as SVGs in React Native are not trivial.

**Expo**

**Axios**
https://axios-http.com/docs/intro

**SQLite Storage**
https://docs.expo.dev/versions/latest/sdk/sqlite/

## Todo

App:

- [N] Create a better TextInput with a clear icon and use that in place of existing TextInput.
- [N] Do we want a whole-app header?
- [N] For QR of JSON and CSV, should we use Stack navigation so the QR image modal close button just returns to the triggering location?
- [x] For Share of JSON and CSV, just call into a global function and pass the key and string content.
- [x] The API returns all the Matches and Pits scouted. We can save those keys and use them in the UI to provide a visual indicator about which features have been scouted, even if by others on the team.
- [ ] Should Pit scouting collect the name of the person scouting or will we be okay with just using the assignment sheet(s).
- [x] Format the tabs better. Come up with icons. Column direction. Colors. Badges.

Match Scouting:

- [?] Header
- [x] Better navigation UI
- [?] Retain tab visibility? Is this desirable or possible?
- [x] Total score should not be -/+.
- [x] Change option buttons to opaque and not a different color from primary.
- [x] Why does Endgame sometimes have an issue with the Option component when the next screen does not. I suspect it's due to the logic that hides/shows the component based on the checkbox but I'm not sure. I need to figure this out because we cannot have that bug show up at a competition. Maybe instead of visible, it's disabled... Not sure yet.
- [x] When we check, "Did hang", we should default to "0" and require a value. We should not be able to deselect the seleted value... only select a new value.
- [ ] Nice to have: When selecting a match to scout, if you made a mistake and made no changes, going back will delete the session? Maybe the session is only created when you click Next/Auo from the Confirm screen.
- [x] When flowing through Match Scouting, we will want a header and the header color should match the color of the Alliance. We also want the team number very prominently displayed so the scouter can very easily be reminded who they are scouting.
- [x] Penalties UI should be reworked so we use the color of the opposing Alliance in addition to whatever guidance text we come up with.
- [x] Confirm Screen: Change "Select Team" to "Back".
- [x] Navigation should have only 2 buttons. Originally, I thought the "Done" might help when editing a session but we decided it introduces to omuch confusion.
- [x] Look into being able to hide the keyboard on the Confirm screen and Final screen so the user can see the buttons after they have entered text.
- [ ] Incorporate the list of keys returned from the API. When a key exists for the Match on the device, display a tablet icon. When a key exists for the Match that is not on the device, display user-group icon.
- [x] When tapping Final > Done, automatically upload.

Match Results:

- [x] All Share JSON
- [N] All Share CSV
- [x] Match Upload
- [x] Match JSON QR
- [N] Match CSV QR
- [x] Match Share JSON
- [N] Match Share CSV
- [?] Retain tab visibility? Is this desirable or possible?
- [ ] Badge to represent the number of scouting sessions yet to be uploaded.

Pit Scouting:

- [x] Header
- [x] Better navigation UI
- [x] All Share JSON
- [N] All Share CSV
- [x] Scout Upload
- [x] Scout JSON QR
- [N] Scout CSV QR
- [x] Scout Share JSON
- [N] Scout Share CSV
- [x] Disable share/QR buttons if the team has not been scouted.
- [x] Change opacity on buttons where the function has been triggered.
- [?] Retain tab visibility? Is this desirable or possible?
- [x] If a team has not yet been scouted, suppress or disable the other buttons.
- [ ] Badge to represent the number of scouting sessions yet to be uploaded.
- [x] When tapping Done, automatically upload.

Settings:

- [x] Within the tab, use Drawer navigation to isolate the different features instead of listing them all on the landing screen.

Fairport Robotics Settings:

- [x] Save endpoint
- [N] Retrieve endpoint?

The Blue Alliance Settigns:

- [x] API Key

Database:

- [x] Share
- [x] Delete data and initialize tables
- [x] Drop tables and initialize tables
