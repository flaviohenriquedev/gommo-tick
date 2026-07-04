const fs = require("fs");
const path = require("path");

const roots = ["src"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const suspiciousCodePoints = [0x00c2, 0x00c3, 0x0192];
const unicodeEscapePattern = /\\u[0-9a-fA-F]{4}/u;
const failures = [];

function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (!extensions.has(path.extname(entry.name))) {
            continue;
        }

        const text = fs.readFileSync(fullPath, "utf8");
        const lines = text.split(/\r?\n/u);

        lines.forEach((line, index) => {
            const hasMojibake = suspiciousCodePoints.some((codePoint) =>
                line.includes(String.fromCodePoint(codePoint))
            );
            const hasUnicodeEscape = unicodeEscapePattern.test(line);

            if (hasMojibake || hasUnicodeEscape) {
                failures.push(`${fullPath}:${index + 1}: ${line.trim()}`);
            }
        });
    }
}

for (const root of roots) {
    walk(root);
}

if (failures.length > 0) {
    console.error(
        "Invalid UI text encoding detected. Use normal UTF-8 text, not mojibake or Unicode escapes."
    );
    for (const failure of failures) {
        console.error(failure);
    }
    process.exit(1);
}
