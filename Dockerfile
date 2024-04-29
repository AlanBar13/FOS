FROM node:20-alpine as base

COPY package.json ./

COPY client ./client

COPY server ./server

RUN npm install

RUN npm run build

FROM node:20-alpine

COPY --from=base ./node_modules ./node_modules
COPY --from=base ./package.json ./package.json
COPY --from=base /client/dist /client/dist
COPY --from=base /server/node_modules /server/node_modules
COPY --from=base /server/build /server/build
COPY --from=base /server/package.json /server/package.json

EXPOSE 5000