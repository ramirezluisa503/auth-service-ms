# 1. Usamos la imagen oficial de Node.js versión 22 (ligera)
FROM node:22-alpine

# 2. Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos solo los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# 4. Instalamos las dependencias de NestJS
RUN npm install

# 5. Copiamos el resto del código fuente del proyecto
COPY . .

# 6. Compilamos el código de TypeScript a JavaScript (genera la carpeta /dist)
RUN npm run build

# 7. Informamos que el contenedor escuchará en el puerto 3000
EXPOSE 3001

# 8. Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "start:dev"]