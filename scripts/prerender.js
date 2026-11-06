import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, prerenderPaths } = await import("../dist-ssr/entry-server.js");

// Empty shell for logged-in routes (Vercel falls back to this)
fs.writeFileSync(path.join(dist, "spa.html"), template.replace("<!--app-html-->", ""));

for (const url of prerenderPaths) {
    const html = template.replace("<!--app-html-->", await render(url));
    const file = url === "/" ? path.join(dist, "index.html") : path.join(dist, url, "index.html");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    console.log("prerendered", url);
}
