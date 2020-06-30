FROM node:12.16.2

WORKDIR /app

COPY back/package*.json ./
RUN npm install

COPY back/. .
COPY script.sh .

#EXPOSE 3000
CMD ./script.sh

