FROM node:24-alpine as build

ARG TARGETOS linux 
ARG TARGETARCH amd64

RUN mkdir -p /tmp
WORKDIR /tmp

# Copy source files
RUN mkdir -p /src
WORKDIR /src
COPY . .

# enable pnpm
RUN npm install -g pnpm

# Build site
RUN pnpm ci && \ 
        pnpm run build

FROM nginx:latest as publish
# Copy static files
COPY --from=build /src/dist /usr/share/nginx/html
