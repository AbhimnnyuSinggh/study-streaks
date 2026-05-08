# Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build 

#Deployer

FROM node:20-alpine AS deployer 

WORKDIR /app

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/.next ./.next 

COPY --from=builder /app/public ./public

RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "start", "--", "-H", "0.0.0.0"]

