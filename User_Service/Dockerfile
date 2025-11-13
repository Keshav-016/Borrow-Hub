FROM node:18

WORKDIR /usr/src/app

# copy package files first for caching
COPY package*.json ./

# install dependencies (include devDependencies so prisma CLI is available)
RUN npm install

# copy rest of source (including prisma/schema.prisma)
COPY . .

# generate Prisma client for the container platform
RUN npx prisma generate

# build the app
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]