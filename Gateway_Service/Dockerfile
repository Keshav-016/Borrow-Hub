FROM node:18

WORKDIR /usr/src/app

# copy package files first for caching
COPY package*.json ./

# install dependencies (include devDependencies so prisma CLI is available)
RUN npm install

# copy rest of source (including prisma/schema.prisma)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]