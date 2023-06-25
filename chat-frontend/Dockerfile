FROM node:20.2-buser-slim as build
WORKDIR /build
ENV NODE_ENV=production
RUN yarn
COPY . .
RUN yarn build
RUN mv /build/dist /app

FROM node:20.2-buster-slim
WORKDIR /app
COPY --from=build /app .
RUN npm install -g serve
ENV PORT=3341
EXPOSE 3341
CMD ["serve", "."]
