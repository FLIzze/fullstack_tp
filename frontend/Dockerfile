FROM oven/bun:1.3.3

WORKDIR /app

COPY package.json bun.lock tsconfig.json vite.config.js postcss.config.js tailwind.config.js index.html ./
COPY src ./src
COPY public ./public

RUN bun install

EXPOSE 5173

CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

