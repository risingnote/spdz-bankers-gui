FROM node:7

# Run the bankers bonus node server to serve the GUI and provide REST services to GUI.
# Build container with:
#   docker build -t spdz/bankers-bonus-gui:v0.3.0 .
# Run container with:
#   docker run -d --rm --name bankers_bonus_gui -p 8080:8080 \ 
#        -v /home/me/config:/usr/app/config \
#        -v /home/me/logs:/usr/app/logs spdz/bankers-bonus-gui:v0.n.m

LABEL name="SPDZ bankers bonus demonstrator GUI." \
      description="Provide the GUI and REST servcies for the bankers bonus demo." \
      maintainer="Jonathan Evans" \
      license="University of Bristol : Open Access Software Licence" 

ENV NODE_ENV=production
ENV LOG_LEVEL=info

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Pull in files (using .dockerignore to restrict)
# Not using npm install because complexity of accessing private github repo from docker.
COPY . /usr/app

EXPOSE 8080

# Mount bankers bonus specific config
VOLUME /usr/app/config
# Logs are kept
VOLUME /usr/app/logs

CMD exec node src/index.js 2>&1 | tee /usr/app/logs/bankers-bonus-gui.log
