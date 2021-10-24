FROM node:14-alpine AS node
FROM node AS builder
RUN apk add g++ make python
WORKDIR /app
COPY package*.json ./
RUN npm i

# Copy the rest of the code
COPY . .
# Invoke the build script to transpile ts code to js
RUN npm run build

FROM node AS final
ENV NODE_ENV production
ENV DATABASE_PATH pokemon.db
ENV SERVER_PORT ${SERVER_PORT}
ENV API_SECRET_HASH ${API_SECRET_HASH}
RUN apk --no-cache -U upgrade
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm i -g pm2
COPY package*.json process.yml src/db/pokemon.db ./
RUN apk add g++ make python

# Switch to user node
USER node
RUN npm i --only=production
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE ${SERVER_PORT}

# Use PM2 to run the application as stated in config file
ENTRYPOINT ["pm2-runtime", "./process.yml"]