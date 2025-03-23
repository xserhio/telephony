FROM node:23-alpine3.20

COPY . .

RUN npm i && npm run build

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]
