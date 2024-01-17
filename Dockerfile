FROM node:20-alpine as build

ARG TARGETOS linux 
ARG TARGETARCH amd64

RUN mkdir -p /tmp
WORKDIR /tmp

# Copy source files
RUN mkdir -p /src
WORKDIR /src
COPY . .

# Build site
RUN npm ci && \ 
        npm run build

FROM nginx:latest as publish
# Copy static files
COPY --from=build /src/dist /usr/share/nginx/html
