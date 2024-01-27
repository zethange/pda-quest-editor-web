FROM oven/bun:alpine

WORKDIR /app
COPY package.json .
COPY bun.lockb .

RUN bun install --production
COPY src src
COPY tsconfig.json .

RUN bun run build

ENV NODE_ENV production
CMD ["bun", "build/main.js"]

EXPOSE 3000
