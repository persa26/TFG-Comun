
# TFG-Común

TFG-Común es un proyecto de gestión de control de accesos que combina dos sistemas de identificación independientes: identificación por tarjeta RFID y reconocimiento facial mediante inteligencia artificial. Este proyecto ha sido desarrollado por dos autores diferentes, @Persa26 para el sistema de identificación por tarjeta RFID y @sesnaola para el sistema de reconocimiento facial. Ambos sistemas han sido desarrollados de forma independiente y se han integrado en este proyecto para su uso conjunto.

## Características

*Gestión de usuarios con acceso al sistema.
*Dos sistemas de identificación independientes: tarjeta RFID y reconocimiento facial mediante IA.
*Registro de los accesos de los usuarios al sistema.
*Panel de administración para la gestión de usuarios y accesos.

## Tecnologías

*Node.js
*Express
*MySQL
*React
*TensorFlow
*OpenCV

## Instalación

Iniciar contenedor de Docker

```bash
  docker-compose up
```

## API

Es necesario estar identificado para  todas las peticiones, excepto para login. Solo hay un usuario administrador y no es posible registrarse ni crear otro usuario administrador.

### URL

```http
  localhost:3080/api/v1
```

### Swagger

```http
  localhost:3080/swagger
```

## Front

### URL

```http
  localhost:8080
```

<!-- ### Get Users

Devuelve todos los usuarios

```http
  GET /api/users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Required**. Your API key |

### Get user

Devuelve el usuario con la ID especificada

```http
  GET /api/users/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch | -->

## Autores

- [@sesnaola](https://github.com/sesnaola)
- [@persa26](https://github.com/persa26)
