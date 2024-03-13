FOS - (Food Ordering System)
-

System that manages and simplifies the way client orders products to a restaurant.

Structure:
-
-  **client** - React based project
-  **server** - Nodejs, express, socketio server
-  **package.json**

Setup project:
-
### Install client side dependencies  ###
```
cd ./client
npm install
```

### Install server side dependencies  ###
```
cd ./server
npm install
```

How to run project (On root of the project):
-
### Running project on development mode  ###
```
npm run dev
```
### Running project on production mode  ###
```
npm run start
```

How to build project (On root of the project):
-
### Simultaniously build server & client  ###
```
npm run build
```

Server and Client can run stand alone
-
```
cd ./client
npm run dev OR npm run start
```
```
cd ./server
npm run dev OR npm run start
```

Prisma migrations
-
```
// Changes made to the schema can be pushed using the following commands
cd ./server
dotenv -e ../.env.local -- npx prisma migrate dev
```
