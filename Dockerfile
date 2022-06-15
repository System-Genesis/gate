FROM node:13.12-alpine AS builder
WORKDIR /
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build

FROM node:13.12-alpine 
WORKDIR /
COPY --from=builder /dist ./dist
COPY --from=builder /src/key ./dist/key
COPY package*.json ./
RUN npm install --production --silent

WORKDIR /dist

CMD node index.js
