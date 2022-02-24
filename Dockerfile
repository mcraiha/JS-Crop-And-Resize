FROM denoland/deno:alpine AS build
WORKDIR /source

COPY src/. src/
COPY tsconfig.json .
RUN deno bundle -c tsconfig.json src/index.ts src/index.js

FROM nginx:1.21.6-alpine
COPY --from=build /source/src /usr/share/nginx/html