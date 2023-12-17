FROM node:latest
LABEL authors="Foka Nikita"
WORKDIR /usr/app/front
EXPOSE 5173
COPY ./ ./
RUN npm install
CMD ["npm", "run", "dev"]