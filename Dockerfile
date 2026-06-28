FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p public/uploads
RUN chmod -R 777 public/uploads

EXPOSE 3000

CMD ["npm", "start"]
