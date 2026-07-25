# Zelko

Editor de documentos LaTeX web, self-hosted, libre y gratuito.

Zelko nació porque instalé LaTeX en mi equipo y quise crear mi propio Overleaf: sin límites, sin pagar, sin restricciones. Es software libre bajo una licencia personal, permite crear documentos con contenido LaTeX y generar PDF al instante. Pensado para uso personal, para compartir con compañeros o con la comunidad.

## Stack

- **Frontend:** Vue 3 + TypeScript + Vite
- **Editor:** CodeMirror 6 con resaltado de sintaxis LaTeX
- **Previsualización:** pdf.js (pdfjs-dist)
- **Estilos:** Tailwind CSS 4
- **Estado:** Pinia
- **API:** Axios con refresh automático de tokens
- **Notificaciones:** vue-toastification
- **Iconos:** lucide-vue-next

## Funcionalidades

- Edición de documentos LaTeX con resaltado de sintaxis
- Compilación LaTeX a PDF (del lado del servidor)
- Vista previa del PDF en el navegador con zoom, ajuste a página y descarga
- Autenticación de usuarios (registro, login, logout)
- Verificación de email
- Autenticación de dos factores (2FA / TOTP)
- Recuperación de contraseña
- CRUD completo de documentos
- Diseño responsivo con panel dividido editor/previsualización

## Empezar

```bash
# Clonar el repositorio
git clone https://github.com/Moisessantos45/zelko.git
cd zelko

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de la API

# Iniciar en desarrollo
bun run dev
```

La API backend corre en `http://localhost:4106/api/v1` (configurable en `.env`).

## Construir para producción

```bash
bun run build
```

## Licencia

Este proyecto está bajo una **Licencia No Comercial**. Ver el archivo [LICENSE](./LICENSE) para más detalles.

Uso permitido: educativo, personal, investigación y desarrollo. No está permitido su uso comercial.
