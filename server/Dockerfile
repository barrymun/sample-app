# Use the official Node.js image
FROM node:18

# create and set working directory in the container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json /usr/src/app/

# Install dependencies
RUN yarn install

# Copy local code to the container image
COPY . /usr/src/app/

EXPOSE 3000

# Specify the command to run on container start
CMD [ "yarn", "start" ]
