# Kidz English (Flash Modernizer)

A modern, high-performance web dashboard for accessing legacy Flash-based English learning courses and documents. Specifically designed for children with a cute, pastel, and accessible interface.

*[Also available in Spanish (README.md)](README.md)*

## Features

- **Kid-Friendly UI**: Fluffy, pastel-themed interface with smooth animations and bold typography.
- **Zero Plugin Required**: Uses the [Ruffle Emulator](https://ruffle.rs/) to play Flash files natively in modern browsers via WebAssembly.
- **Auto-Scanning**: Automatically detects all your Flash games and documents (PDF, DOC, DOCX) through a Python manifest generator.
- **Document Support**: Includes a built-in document reader for accompanying course materials.
- **Responsive Design**: Works on desktop monitors, tablets, and phones gracefully.

## How to Run

1. Navigate to this directory:
   ```bash
   cd Flash-Modernizer
   ```
2. Start the application:
   ```bash
   npm install   # (If running for the first time)
   npm run dev
   ```
3. Open the URL provided (e.g. `http://localhost:5173` or `http://localhost:10000`) in your browser.

## Adding New Courses & Folder Structure

All games, resources, and documents must be placed inside the `public/assets-flash` folder.

The application uses a dynamic categorization system. Any folder you place directly inside `assets-flash` will automatically become a "Grade/Category" tab in the left sidebar menu (e.g., `1º Prim`, `BUGS_3`, `Dictionaries`).

### Accepted File Structure

The `generate_manifest.py` script recursively scans these folders looking for:

- **Interactive Flash Games**: It looks for entry point files (e.g., `Main.swf`, `index.swf`, `app.swf`, `bugs_cd3_shell.swf`, `BUGS.SWF`).
- **Reading Materials**: It indexes any file with `.pdf`, `.doc`, or `.docx` extensions as viewable documents.

**Example Structure:**

```text
public/assets-flash/
├── 1º Prim/                              <-- Automatically becomes a sidebar category
│   ├── Lesson 1/
│   │   ├── Main.swf                      <-- Detected as a Playable Game
│   │   ├── assets/                       <-- Internal assets for the SWF
│   │   └── Worksheet.pdf                 <-- Detected as a Reading Document!
│   └── alphabet.pdf                      <-- Detected as a Reading Document!
├── BUGS_3/                               <-- Becomes a new sidebar category
│   └── files/
│       └── bugs_cd3_shell.swf            <-- Detected as a Playable Game
└── Dictionaries/
    └── English_Dict.swf                  <-- Detected as a Playable Game
```

### Updating the Catalog

Whenever you add, modify, or remove any file or folder from `public/assets-flash`, you **must regenerate the index database** by running:

```bash
python3 generate_manifest.py
```

This will instantly update `src/manifest.json`, and the changes will be reflected in the app immediately.

## Project Architecture

- `generate_manifest.py`: Python script to scan the folders and generate the catalog.
- `src/App.jsx`: The main React dashboard and embedded players logic.
- `vite.config.js`: Contains custom middleware to fix old case-sensitivity issues and patch empty CDATA elements in legacy XML files on-the-fly.
