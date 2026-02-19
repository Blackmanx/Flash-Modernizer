import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

// Flash CD-ROM games often mismatch case when loading XML data or assets because Windows is case-insensitive.
// On Linux/Vite, this causes 404s leading to "undefined" text variables.
function caseInsensitiveAssets() {
    return {
        name: 'case-insensitive-assets',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url.startsWith('/assets-flash/')) return next()

                try {
                    // Try to decode the URL path
                    const urlPath = decodeURIComponent(req.url.split('?')[0])
                    const absolutePath = path.join(process.cwd(), 'public', urlPath)

                    // If file exists exactly, serve it or process it
                    if (fs.existsSync(absolutePath)) {
                        if (absolutePath.toLowerCase().endsWith('.xml')) {
                            const xmlContent = fs.readFileSync(absolutePath, 'utf-8');
                            const modifiedXml = xmlContent.replace(/<!\[CDATA\[\s*\]\]>/g, '<![CDATA[ &nbsp; ]]>');
                            res.setHeader('Content-Type', 'text/xml');
                            res.write(modifiedXml);
                            res.end();
                            return;
                        }
                        return next();
                    }

                    // Try segment by segment from 'public' to find the case-insensitive equivalent
                    let currentPath = path.join(process.cwd(), 'public')
                    const segments = urlPath.split('/').filter(Boolean)

                    for (const segment of segments) {
                        const files = fs.readdirSync(currentPath)
                        const match = files.find(f => f.toLowerCase() === segment.toLowerCase())

                        if (match) {
                            currentPath = path.join(currentPath, match)
                        } else {
                            // File genuinely not found
                            return next()
                        }
                    }

                    // We found a mismatching-case file, rewrite req.url to point to it
                    // so Vite's static server processes it properly
                    // remove public part of path
                    const rewrittenUrl = currentPath.substring(path.join(process.cwd(), 'public').length)
                    req.url = rewrittenUrl + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '')

                    // NEW ADDITION: If it's an XML file, intercept it to fix empty CDATA blocks
                    if (req.url.toLowerCase().endsWith('.xml')) {
                        const xmlContent = fs.readFileSync(currentPath, 'utf-8');
                        // Replace empty CDATAs with a non-breaking space so Ruffle doesn't say "undefined"
                        const modifiedXml = xmlContent.replace(/<!\[CDATA\[\s*\]\]>/g, '<![CDATA[ &nbsp; ]]>');

                        res.setHeader('Content-Type', 'text/xml');
                        res.write(modifiedXml);
                        res.end();
                        return;
                    }
                } catch (e) {
                    // ignore generic read errors
                }

                next()
            })
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), caseInsensitiveAssets()],
    server: {
        watch: {
            ignored: ['**/public/assets-flash/**']
        },
        port: 10000,
    }
})
