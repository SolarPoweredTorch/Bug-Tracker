# Bug-Tracker

A full stack bug tracking web app written in Typescript. This project is fully open source.

## Features

- Issue management system: End-users have the ability to create bug reports (tickets) as well as update existing report fields. Finally, tickets may be closed or deleted outright.
- Bug ticket details: Reports are defined by bug type, severity, creation and modification dates, current status, as well as a further open-ended description (may include reproducibility, systems affected, etc.). Users can be assigned or unassigned on the ticket view UI. Issue reports are, of course, stored on the server database.
- Comments and notifications: Discussions on bug reports, assignment changes, etc. are tracked and sent out by the server to all relevant users.
- Statistics and charts: Because it's just nice to see.

<img width="1851" height="958" alt="Screenshot_20250803_090042" src="https://github.com/user-attachments/assets/fa163219-7934-49a2-ad5d-2cd2d0d1be50" />

## Environment requirements

- MongoDB account and database (e.g. Atlas is fine).
- Node.js and npm package manager. For Windows, ensure Node.js is on your PATH. These installations vary by OS and distro, but can be universally verified with:
```
node -v
npm -v
```

## Deployment

1. Download the source code to an empty directory:

```
git clone https://github.com/SolarPoweredTorch/Bug-Tracker.git
```

2. Install dependencies for both the client and server. From the root of the cloned git directory:

```
cd /frontend
npm install
cd ../backend
npm install
```

3. Configure the .env file. This small file, located at the root of the server directory, sets sensitive local environment variables. Thus, creating your own (in `/backend`) is necessary:

```
touch .env
echo 'PORT="5000"' >> .env
echo 'MONGO_CONNECTION="XXXXXX"' >> .env
echo 'SESSION_SECRET="YYYYYY"' >> .env
```

4. Set the Mongo connection string to your own (beginning with `mongodb+srv://`), as well as the session secret to a random sequence of alphanumeric characters. Or not, if simply running locally.

5. Open two separate terminals, one in `/frontend` and one in `/backend`. These run the client and server which can both be started by separately running in each:

```
npm start
```

6. Once the server is up, open a browser and go to `http://localhost:3000/`.

## To implement later

- Permission structures
- Better scalability (lazy loading in particular)
- Color modes and other UI improvements
- Profile pictures and image support
