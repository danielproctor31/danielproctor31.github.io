---
title: "Duck DNS and Docker"
description: ""
pubDatetime: 2022-03-01
author: Daniel Proctor
featured: false
---

[Duck DNS](https://www.duckdns.org/) is a service which lets you setup (up to 5) free sub domains on duckdns.org. In this post I will go over
how I have automated this using Docker.

## Why?
I use a home server for various things - a plex server, vpn, game servers to name a few. What if i need to access it remotely, Or Share an address so my friends can join a game? I could share my ip address and this would work for a time, but depending on what ISP you are with, your ip will likely change at some point in the near future. This is where Duck DNS comes in. Using their api and a cron job, we can use a duckdns.org subdomain and keep it updated with the correct ip.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- A [duckdns](https://www.duckdns.org) account.

Note that this tutorial is assuming you will be using linux containers with docker.

## Creating your Subdomain
Login to https://www.duckdns.org using one of the login methods they provide. Here you will be presented with a page which lets you create a subdomain. Take note of the token displayed on this page as we will be using it later. Go ahead a create a subdomain. You will see the ip is set to your current ip address. This is what we will be changing using their api and your token.

## Bash Script
Duck DNS provide an endpoint to keep your ip's update to date:
```
https://www.duckdns.org/update?domains=YourSubDomains&token=YourToken&ip=OptionalIp
```
Here we can see they allow 3 query parameters.
- Domains - A comma separated string of your subdomains to update with the ip.
- Token - Your token we saw earlier.
- ip - This one is optional. You can provide an ip address. Or Duck DNS will determine your ip from where the request is coming from. In this instance we are assuming you want to use your current ip and will be leaving it blank.

I have written a simple bash script which uses curl to call this endpoint:
```
#!/bin/sh

echo "Updating ip for domains: $DOMAINS"

if [ -n "$IP" ]; then
  echo "using ip: $IP"
fi

echo "$(curl "https://www.duckdns.org/update?domains=$DOMAINS&token=$TOKEN&ip=$IP")"
```
Here we are using environment variables for the domains, ip and token. The script will echo the domains to be updated and the ip given if present. It will then use curl to call the endpoint with the given parameters and echo the output. Save this file as `run.sh`

## Cron Job
We could run this script manually. But the idea is we want to automate this and not have to worry about it in future. For this we will be using cron.

```
*/5 * * * * /duckdns/run.sh >> /proc/1/fd/1 2>/proc/1/fd/2
# Newline to make file valid
```
Here we have a cronfile which calls our script every 5 minutes and outputs to the shell. Note the `run.sh` is being called in a /duckdns folder. We will be setting that up during the docker build.
Save this as file `cronconfig`

A handy site for create cron schedules is [crontab.guru](https://crontab.guru/#*/5_*_*_*_*)


## Docker
We will be creating a custom Docker image to setup the cron.

```
FROM alpine:latest

# Create duckdns dir
RUN mkdir /duckdns
WORKDIR /duckdns

# Copy files
COPY run.sh run.sh
COPY cronconfig cronconfig

# Install dos2unix
RUN apk update \
    apk --no-cache add dos2unix
RUN apk add curl

# ensure scripts are using correct line endings
RUN dos2unix "run.sh"

# Set permissions
RUN chmod 0644 "cronconfig"
RUN chmod 0744 "run.sh"

## setup cron configs
RUN crontab "cronconfig"

# start container with crond
CMD ["crond", "-f"]
```
This Dockerfile performs the following steps:
- Use alpine as a base image.
- Create a directory where we will store our files.
- Copies our `run.sh` and `cronconfig` into the folder.
- Install dos2unix and curl.
- Uses dos2unix to ensure our files are using the correct line endings.
- Sets the correct permissions on the file so they can be executed.
- Runs crontab with our config to setup our cron.
- Finally set the container to startup with crond and runs in the foreground. Save this as `Dockerfile`

The reason dos2unix is required is if we are working on a windows or other non-unix operating system. The line endings without our files will be save as CRLF. As the Docker image is unix based (which uses LF line endings), this can causes issues running our scripts. using dos2unix ensure they are correct in every build regardless of the operating system they were created on.

### Docker-Compose
I like to use docker-compose wherever I can. It makes recreating containers easier and reproducible without remembering any lengthy docker run commands. We can also specify our environment variables within the compose file.

```
version: "2.4"
services:
  app:
    build:
      context: .
    env_file:
      - .env
    container_name: duck-dns
    restart: unless-stopped
```
Save this as `docker-compose.yml`

Note we have specified an env file. Create a file called `.env` within the same directory with the following content. Replacing the values with your relevant subdomains, token and optional ip.
```
DOMAINS=yourdomain1,yourdomain2
TOKEN=yourtoken
IP=
```

## Run the Container
Finally we can get the container running. Run the container with :
```
docker-compose up -d
```
Let it do its thing and once it's up and running you can check the logs to ensure it's working as expected:
```
docker container logs duck-dns --follow
```
You should see something similar to this:
```
Updating ip for domains: yourdomain
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100     2    0     2    0     0      1      0 --:--:--  0:00:01 --:--:--     1
OK
```

## All done

That's everything. Now you access your home network from wherever you need without needing to know the ip address. I have the final code setup as a github project [here](https://github.com/danielproctor31/duck-dns-docker).