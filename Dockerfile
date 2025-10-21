###################################################
# This Dockerfile is used by the docker-compose.yml
# file to build the development container.
# Do not make any changes here unless you know what
# you are doing.
###################################################

FROM node:20-bullseye as dev

# 🧱 Basic setup
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y openssl

WORKDIR /app

# 🧠 Add Kai bootstrap to auto-load on shell start
# When a terminal opens or you exec into the container, your Kai context will auto-load.
RUN echo 'bash /workspaces/ActualFork/kai-bootstrap.sh' >> /root/.bashrc

# 💾 Add your Notes directory to the PATH so you can run save-kai-note.sh from anywhere
ENV PATH="/workspaces/ActualFork/Notes:${PATH}"

# 🏁 Start as usual
CMD echo 'bash /workspaces/ActualFork/kai-bootstrap.sh' >> /root/.bashrc && \
    echo "✅ Kai bootstrap linked to .bashrc" && \
    sh ./bin/docker-start
