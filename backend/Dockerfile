FROM node:24 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# -------------------------
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

RUN chown -R node:node /app
USER node

CMD ["node", "dist/index.js"]