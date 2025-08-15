# Tahap 1: Build aplikasi React
# Gunakan image Node.js sebagai base image
FROM node:20-alpine AS build

# Tentukan direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json untuk menginstal dependensi
COPY package*.json ./

# Instal semua dependensi
RUN npm install

# Salin semua file sumber (source code)
COPY . .

# Jalankan build command untuk membuat versi production
RUN npm run build

# Tahap 2: Sajikan aplikasi dengan Nginx
# Gunakan image Nginx sebagai server
FROM nginx:alpine

# Salin file konfigurasi Nginx kustom (jika ada)
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Hapus file default Nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin hasil build dari tahap 1 ke direktori Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Ekspos port 80 untuk akses web
EXPOSE 80

# Jalankan Nginx ketika container dimulai
CMD ["nginx", "-g", "daemon off;"]