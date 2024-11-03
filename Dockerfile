FROM node:20

WORKDIR /app

COPY . ./
COPY package*.json ./
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY .gitmodules ./

RUN npm run init-submodules

RUN corepack enable pnpm && pnpm install

RUN corepack enable pnpm && pnpm run build

CMD ["npm", "run", "start"]
