FROM node:10 as builder

COPY . /app

RUN cd /app && npm ci && npm run build

FROM node:10

ENV NODE_ENV production

COPY --from=builder /app/package* /app/
COPY --from=builder /app/dist /app/dist

WORKDIR /app

RUN npm ci --production

CMD [ "npm" "run" "start:prod" "--production" ]
