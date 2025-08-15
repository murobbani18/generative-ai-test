# Gunakan image Node.js sebagai base image
FROM node:20-alpine

# Tentukan direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal semua dependensi
RUN npm install

# Salin semua file sumber (source code)
COPY . .

# Ekspos port yang digunakan oleh server Express (standar 3000)
# Jika server Anda berjalan di port lain, ubah angka 3000 ini
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]