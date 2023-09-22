FROM node:20

ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN npm install -g @angular/cli

COPY . .

RUN npm install
RUN ng build --configuration=production

#EXPOSE 8017

#CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "8017"]

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "5000"]
