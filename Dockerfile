FROM denoland/deno:alpine AS build
WORKDIR /source

COPY src/. src/
COPY tsconfig.json .
RUN deno bundle --platform browser src/crop-and-resize.ts -o src/crop-and-resize.js

FROM nginx:1.31.4-alpine
COPY --from=build /source/src /usr/share/nginx/html