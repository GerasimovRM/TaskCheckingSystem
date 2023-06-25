FROM node:20.2-buster-slim as build
WORKDIR /build
ENV NODE_ENV=production
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build
RUN mv /build/dist /app

FROM node:20.2-buster-slim
WORKDIR /app
COPY --from=build /app .
RUN npm install -g serve
ENV PORT=3340
EXPOSE 3340
CMD ["serve", "."]
