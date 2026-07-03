FROM node:18-slim

WORKDIR /app

# نسخ ملفات package.json و package-lock.json أولاً
COPY package*.json ./

# تثبيت الاعتماديات
RUN npm ci --only=production

# نسخ باقي الملفات
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]