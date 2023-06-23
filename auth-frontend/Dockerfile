FROM node:lts-alpine3.17 as build
WORKDIR /build
ENV NODE_ENV=production
RUN yarn
COPY . .
RUN yarn build
RUN mv /build/dist /app

FROM node:lts-alpine3.17
WORKDIR /app
COPY --from=build /app .
RUN npm install -g serve
ENV PORT=3340
EXPOSE 3340
CMD ["serve", "."]