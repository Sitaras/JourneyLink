FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package*.json tsconfig.json ./
RUN npm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN npm run build

FROM base AS prod
COPY package*.json ./
RUN npm install --omit=dev --frozen-lockfile
COPY --from=build /app/dist ./dist

EXPOSE 8000
CMD ["npm", "start"]