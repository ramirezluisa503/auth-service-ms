# Microservicio de Autenticación (auth-service-ms)

## 👥 Equipo de Trabajo
* **Carlos Eduardo Grajales Cano**
* **Luisa Fernanda Ramirez Osorio**

---

## 📝 Propósito del Proyecto
Este repositorio forma parte de una **aplicación de agendamiento de citas** basada en microservicios. La función principal de este componente es la **Gestión de Identidad y Seguridad**.

### Responsabilidades del Microservicio:
* Gestión del registro y login de usuarios.
* Validación de tokens de seguridad (JWT).
* Control de acceso para los demás servicios (Citas, Usuarios, Pagos).

---

## 🛠️ Cómo iniciar el proyecto
El proyecto fue generado utilizando la **CLI de NestJS** y cuenta con una configuración de **Docker** para asegurar que el entorno sea consistente.

### Ejecución Local:
1. Instalar dependencias: `npm install`
2. Correr la aplicación: `npm run start:dev`

### Ejecución con Docker:
```bash
docker build -t auth-service-ms .
docker run -p 3000:3000 auth-service-ms
