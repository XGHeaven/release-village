FROM node:10 as builder

COPY . /app

RUN cd /app && npm ci && npm run build

FROM node:10

ENV NODE_ENV production
EXPOSE 3000
WORKDIR /app
HEALTHCHECK CMD curl http://localhost:3000/health

COPY --from=builder /app/package* /app/
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/config /app/config

RUN npm ci --production

CMD [ "npm", "run", "start:prod", "--production" ]
