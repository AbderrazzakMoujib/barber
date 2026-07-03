# مرحلة البناء
FROM node:18-slim as builder

WORKDIR /app

# نسخ ملفات package.json أولاً لاستخدام الذاكرة المؤقتة
COPY package*.json ./
RUN npm ci

# نسخ باقي الملفات ثم البناء
COPY . .
RUN npm run build

# مرحلة التشغيل (صورة أصغر)
FROM nginx:alpine

# نسخ ملفات البناء من المرحلة السابقة
COPY --from=builder /app/build /usr/share/nginx/html

# تحسين إعدادات nginx (اختياري)
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]