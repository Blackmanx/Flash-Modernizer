# Kidz English (Flash Modernizer)

Un panel web moderno y de alto rendimiento para acceder a cursos de inglés en Flash y documentos heredados. Diseñado específicamente para niños con una interfaz adorable, en tonos pastel y fácil de usar.

*[Also available in English (README_en.md)](README_en.md)*

## Características
- **Interfaz para niños**: Diseño en tonos pastel, amigable, con animaciones fluidas y tipografía clara.
- **Sin necesidad de plugins**: Utiliza el [Emulador Ruffle](https://ruffle.rs/) para reproducir archivos Flash de forma nativa en navegadores modernos mediante WebAssembly.
- **Escaneo Automático**: Detecta automáticamente todos tus juegos Flash y documentos (PDF, DOC, DOCX) a través de un script en Python que genera el catálogo.
- **Soporte de Documentos**: Incluye un lector de documentos integrado para los materiales del curso.
- **Diseño Responsivo**: Funciona a la perfección en monitores de ordenador, tabletas y teléfonos móviles.

## Cómo ejecutarlo

1. Navega hasta este directorio:
   ```bash
   cd /home/blackman/Documents/Layda-English/Flash-Modernizer
   ```
2. Inicia la aplicación:
   ```bash
   npm install   # (Si es la primera vez que lo ejecutas)
   npm run dev
   ```
3. Abre la URL proporcionada (por ejemplo, `http://localhost:5173` o `http://localhost:10000`) en tu navegador web.

## Añadir nuevos cursos y estructura de carpetas

Todos los juegos, recursos y documentos deben guardarse dentro de la carpeta `public/assets-flash`.

La aplicación utiliza un sistema de categorización dinámico. Cualquier carpeta que pongas directamente dentro de `assets-flash` se convertirá automáticamente en una pestaña separada (Grado/Categoría) en el menú lateral de la izquierda (por ejemplo, `1º Prim`, `BUGS_3`, `Dictionaries`).

### Estructura de archivos aceptada

El script `generate_manifest.py` escanea recursivamente estas carpetas buscando:
- **Juegos Flash interactivos**: Busca archivos principales de arranque o puntos de entrada (e.g., `Main.swf`, `index.swf`, `app.swf`, `bugs_cd3_shell.swf`, `BUGS.SWF`).
- **Materiales de lectura**: Indexa cualquier archivo con extensión `.pdf`, `.doc` o `.docx` como documento de texto visualizable dentro del propio juego.

**Ejemplo de estructura recomendada:**
```text
public/assets-flash/
├── 1º Prim/                              <-- Se convierte automáticamente en una categoría
│   ├── Lesson 1/
│   │   ├── Main.swf                      <-- Detectado como Juego Flash jugable
│   │   ├── assets/                       <-- Archivos internos o recursos del SWF
│   │   └── Worksheet.pdf                 <-- Detectado como material de Documento Lectura!
│   └── alphabet.pdf                      <-- Detectado como material de Documento Lectura!
├── BUGS_3/                               <-- Nueva categoría en el panel lateral
│   └── files/
│       └── bugs_cd3_shell.swf            <-- Detectado como Juego Flash jugable
└── Dictionaries/
    └── English_Dict.swf                  <-- Detectado como Juego Flash jugable
```

### Actualizar el catálogo
Siempre que añadas, edites o borres cualquier archivo o carpeta en `public/assets-flash`, **debes regenerar la base de datos** del índice ejecutando:

```bash
python3 generate_manifest.py
```

Esto actualizará al instante el archivo `src/manifest.json`, y los cambios se reflejarán de forma inmediata en la aplicación.

## Arquitectura del Proyecto
- `generate_manifest.py`: Script de Python para escanear las carpetas y crear el catálogo digital.
- `src/App.jsx`: Panel principal y lógica superpuesta en React.
- `vite.config.js`: Contiene interceptores para arreglar incompatibilidades antiguas entre las mayúsculas (ignorando mayúsculas/minúsculas) y también parchea "al vuelo" los elementos CDATA vacíos en viejos archivos XML de los juegos Flash para evitar fallos de las librerías al cargar.
