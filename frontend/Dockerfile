# Tahap 1: Build aplikasi React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Tahap 2: Sajikan aplikasi dengan Nginx
FROM nginx:alpine

# Hapus file konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Salin file konfigurasi Nginx kustom Anda
COPY ./nginx.conf /etc/nginx/conf.d/

# Hapus file default Nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin hasil build dari tahap 1 ke direktori Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Ekspos port 80 untuk akses web
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]