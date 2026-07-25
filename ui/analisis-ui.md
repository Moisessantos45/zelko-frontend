# Análisis de Interfaz de Usuario y Sistema de Diseño de Zelko

Este documento contiene el análisis técnico exhaustivo de los colores, tokens de diseño y patrones de interfaz de usuario (UI) definidos en la aplicación **Zelko**, basados en la inspección de `src/style.css`, `src/views/admin/HomeView.vue` y `src/views/admin/DocumentEditorView.vue`.

---

## 1. Análisis de Colores y Tokens de Diseño (`src/style.css`)

El archivo `src/style.css` constituye la base del sistema visual de Zelko. Define un conjunto de **variables CSS personalizadas (CSS Custom Properties)** para un diseño **Light-Mode First**, limpio, moderno y minimalista estilo ERP.

### 1.1 Paleta de Colores y Variables CSS

| Categoría | Variable CSS | Código HEX / Valor | Descripción y Uso en la UI |
| :--- | :--- | :--- | :--- |
| **Fondos / Superficies** | `--color-bg` | `#fafafa` | Fondo principal de la aplicación (Gris muy suave). |
| | `--color-surface` | `#ffffff` | Blanco puro para tarjetas, contenedores y paneles. |
| | `--color-surface-alt` | `#f4f4f5` | Gris claro para fondos secundarios, hover en filas y cabeceras de tablas. |
| | `--color-surface-raised`| `#ffffff` | Fondo elevado para modales y menús flotantes. |
| **Bordes** | `--color-border` | `#e4e4e7` | Bordes sutiles para tarjetas, divisores y delimitadores de inputs. |
| | `--color-border-focus` | `#15803d` | Color de borde al enfocar elementos interactivos. |
| **Tipografía / Tinta** | `--color-ink` | `#09090b` | Tinta primaria (Zinc 950) para títulos principales y texto legible. |
| | `--color-ink-secondary`| `#52525b` | Tinta secundaria (Zinc 600) para descripciones, subtítulos e íconos pasivos. |
| | `--color-ink-muted` | `#a1a1aa` | Tinta atenuada (Zinc 400) para placeholders, deshabilitados y contadores. |
| **Marca Principal (Verde Bosque)**| `--color-primary` | `#15803d` | Acciones primarias (botones de creación, enlaces activos, foco). |
| | `--color-primary-hover`| `#166534` | Estado hover para elementos verdes principales. |
| | `--color-primary-subtle`| `#f0fdf4` | Fondo verde transparente/suave para badges de éxito y resaltados. |
| **Marca Secundaria** | `--color-secondary` | `#15803d` | Alineada con la marca primaria verde bosque. |
| | `--color-secondary-hover`| `#166534` | Hover secundario. |
| | `--color-secondary-subtle`| `#f0fdf4` | Fondo secundario suave. |
| **Acentos / Advertencias (Oro)**| `--color-accent` | `#ca8a04` | Resaltados especiales, llamados de atención y advertencias. |
| | `--color-accent-hover` | `#a16207` | Hover de acento. |
| | `--color-accent-subtle` | `#fef9c3` | Fondo amarillo suave para avisos o búsquedas activas. |
| **Estados del Sistema** | `--color-success` | `#15803d` | Indicador de estado exitoso o compilado correctamente. |
| | `--color-success-subtle`| `#f0fdf4` | Fondo para chips o pills de estado exitoso. |
| | `--color-warning` | `#ca8a04` | Indicador de aviso o precaución. |
| | `--color-warning-subtle`| `#fef9c3` | Fondo de aviso. |
| | `--color-danger` | `#ef4444` | Rojo para errores de compilación, eliminaciones o avisos críticos. |
| | `--color-danger-subtle` | `#fef2f2` | Fondo rosado suave para alertas o estados de error. |
| | `--color-info` | `#2563eb` | Azul para información o funciones de sintaxis específicas. |
| | `--color-info-subtle` | `#eff6ff` | Fondo de información suave. |
| **Barra Lateral Activa** | `--color-sidebar-active-bg`| `#f4f4f5` | Fondo del ítem activo en navegación lateral. |
| | `--color-sidebar-active-text`| `#09090b` | Texto del ítem activo. |

### 1.2 Sombras, Radios y Fuentes

- **Sombras:**
  - Tarjetas: `--shadow-card: 0 1px 2px 0 rgba(0,0,0,0.05)`
  - Modales: `--shadow-modal: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)`
- **Bordes Redondeados (Border Radii):**
  - Pequeño (`--radius-sm`): `4px`
  - Mediano (`--radius-md`): `6px`
  - Grande (`--radius-lg`): `8px`
  - Extra Grande (`--radius-xl`): `12px`
  - Redondo completo (`--radius-full`): `9999px`
- **Tipografía:**
  - Sans-Serif Primaria: `'Inter', system-ui, -apple-system, sans-serif` (`--font-sans`)
  - Monoespaciada (Código/LaTeX): `'JetBrains Mono', monospace` (`--font-mono`)

---

## 2. Análisis UI de la Vista Dashboard (`src/views/admin/HomeView.vue`)

La vista del Dashboard de inicio implementa la lista de documentos LaTeX del usuario y demuestra la aplicación práctica de los tokens de diseño de Zelko.

### 2.1 Componentes y Patrones Visuales

1. **Cabecera de Módulo (Header):**
   - Título en `text-base font-bold text-(--color-ink)` con contador dinámico en `text-xs text-(--color-ink-secondary)`.
   - Botón de Acción Principal en verde de marca: `bg-(--color-primary) hover:bg-(--color-primary-hover) text-white` con ícono Lucide (`Plus`).

2. **Tarjetas de Lista de Documentos (Document Cards):**
   - Superficie: `bg-(--color-surface)` sobre borde `border-(--color-border)`.
   - Interacción: Transición con `hover:bg-(--color-surface-alt)` y resalte de borde sutil `hover:border-(--color-primary)/30`.
   - Contenedor de Ícono: Círculo/Cuadro suavizado `bg-(--color-primary)/10` con ícono `FileText` teñido en `text-(--color-primary)`.
   - Información de texto: Título en `text-sm font-semibold text-(--color-ink)` que cambia a verde en hover (`group-hover:text-(--color-primary)`), fecha en `text-xs text-(--color-ink-secondary)`.

3. **Acciones Secundarias por Documento:**
   - Botón de copiar URL: Cuadro interactivo en `bg-(--color-surface)` con borde, ícono `Copy` o `Check` verde (`text-green-600`) al confirmar.
   - Selector de Visibilidad: `DynamicDropdown` integrado con ancho definido.

4. **Estado Vacío (Empty State) y Carga (Skeleton Loaders):**
   - Esqueleto: Tarjetas animadas mediante `animate-pulse` con fondo `bg-(--color-surface)` y borde.
   - Estado Vacío: Ícono centralizado `FileText` de 24px en contenedor redondeado `w-14 h-14 bg-(--color-surface)` con mensaje descriptivo y botón directo para crear documento.

---

## 3. Análisis Profundo de la UI del Editor (`src/views/admin/DocumentEditorView.vue`)

`DocumentEditorView.vue` es la vista central de edición de Zelko. Presenta un espacio de trabajo tipo **IDE web dividido (Split Pane Workspace)** optimizado para código LaTeX y previsualización de documentos.

### 3.1 Arquitectura de Layout y Distribución

- **Pantalla Completa:** La vista ocupa el 100% de la altura disponible (`h-full overflow-hidden`) dentro de un contenedor flexible `flex flex-col bg-(--color-bg)`.
- **Panel Dividido Ajustable (Split View):**
  - Se compone de `DocumentEditorPane.vue` a la izquierda y `DocumentPreviewPane.vue` a la derecha.
  - **Resizer / Divisor Interactivo:** Barra central resizable con ancho `w-2 bg-(--color-surface) hover:bg-(--color-surface-alt) border-x border-(--color-border)` que cambia el cursor a `col-resize` al arrastrar. Permite ajustar dinámicamente el ancho de los paneles mediante listeners de ratón en tiempo real.

### 3.2 Overlay de Estado de Carga (Loading Overlay)

- **Capa Translúcida:** `bg-black/10 backdrop-blur-xs flex items-center justify-center` fija a pantalla completa.
- **Tarjeta Elevada:** Contenedor flotante `bg-(--color-surface) border border-(--color-border) rounded-xl shadow-lg` en texto `text-sm text-(--color-ink)`.
- **Spinner de Carga:** Anillo animado en verde verde de la marca: `w-4 h-4 border-2 border-(--color-primary)/30 border-t-(--color-primary) rounded-full animate-spin`.

### 3.3 Franja de Control Superior (`DocumentEditorPane.vue`)

- **Barra Compacta:** Altura `h-9 px-3 bg-(--color-surface) border-b border-(--color-border)` que optimiza el espacio vertical.
- **Campo de Título Inline:** Input plano con fondo `bg-(--color-surface-alt)` y borde sutil, enfocado mediante `focus:ring-1 focus:ring-(--color-primary) focus:border-(--color-primary)`.
- **Badge de Estado de Compilación:**
  - Compilado con éxito: `bg-(--color-success-subtle) text-(--color-success)` (Verde).
  - Error en sintaxis: `bg-(--color-danger-subtle) text-(--color-danger)` (Rojo).
- **Contador de Líneas:** Muestra el número total de líneas en `text-xs text-(--color-ink-muted)`.

### 3.4 Tema de Editor CodeMirror ("Zelko Theme")

El editor CodeMirror 6 utiliza una tematización minuciosamente ajustada a los tokens del sistema:

```javascript
// Paleta del Editor Zelko CodeMirror
Fondo Editor: #ffffff (Puro)
Texto Código: #09090b (Zinc 950, Fuente 'JetBrains Mono', 13px, Line-height 1.6)
Cursor: #15803d (Verde Bosque)
Línea Activa: #f0fdf4 (Verde Suave)
Selección de Texto: #dcfce7
Gutter (Números de Línea): Fondo #fafafa, Texto #a1a1aa, Borde #e4e4e7
Línea Activa en Gutter: Fondo #f0fdf4, Texto #15803d
Coincidencia de Búsqueda: #fef9c3 (Amarillo Acento)
```

### 3.5 Esquema de Resaltado de Sintaxis (LaTeX Syntax Highlighting)

| Elemento de Sintaxis | Color Asignado | Ejemplo LaTeX |
| :--- | :--- | :--- |
| **Palabras Clave / Control** | `#15803d` (Verde, Negrita) | `\documentclass`, `\begin`, `\end`, `\usepackage` |
| **Nombres de Tipos / Átomos** | `#ca8a04` (Oro / Acento) | Opciones de clase, números y constantes |
| **Definiciones / Funciones** | `#2563eb` (Azul Info) | Comandos personalizados, etiquetas, nombres de variables |
| **Cadenas y Argumentos** | `#166534` (Verde Oscuro) | Rutas de imagen, títulos de sección |
| **Comentarios** | `#a1a1aa` (Gris Cursiva) | `% Comentario en documento` |
| **Títulos / Secciones** | `#15803d` (Verde, Negrita) | `\section{}`, `\subsection{}` |

---

## 4. Normalización de la Interfaz para Vistas de Autenticación (`src/views/auth/`)

Para asegurar la coherencia estética en todo Zelko, las vistas de la carpeta `src/views/auth/` deben seguir rigurosamente estas pautas derivadas de `src/style.css`:

1. **Uso Exclusivo de Variables CSS de Tailwind v4:**
   - Usar `bg-(--color-surface)` para tarjetas de login/registro.
   - Usar `border-(--color-border)` para bordes contenedores y divisores.
   - Usar `text-(--color-ink)` para títulos primarios y `text-(--color-ink-secondary)` para explicaciones.
   - Usar `bg-(--color-primary)` y `hover:bg-(--color-primary-hover)` para botones de enviar/enviar formulario.

2. **Contenedores de Ícono de Cabecera:**
   - Reemplazar las clases desfasadas (`bg-green-50 text-green-600 border-green-100`) por la sintaxis estandarizada del sistema:
     `bg-(--color-primary-subtle) text-(--color-primary) border border-(--color-primary)/20`.

3. **Formularios e Inputs Integrados:**
   - Los campos de texto e inputs utilizan la estructura de `InputField.vue` con bordes `--color-border` y enfoque mediante `--color-primary`.
   - Enlaces de navegación entre autenticación (p. ej. "¿Olvidaste tu contraseña?" o "Regístrate aquí") deben usar `text-(--color-primary) hover:underline font-semibold`.

---
*Documento generado como referencia oficial de arquitectura visual para Zelko.*
