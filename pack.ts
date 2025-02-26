import fs from "fs";
import path from "path";
import webfont from "webfont";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsv = fs.readFileSync(path.resolve(__dirname, "icons.tsv"), "utf8");
const lines = tsv.split("\n");
const icons = lines
	.map((line) => line.split("\t"))
	.slice(1)
	.filter((icon) => icon.length === 5)
	.map((icon) => {
		return [icon[3].slice(0, -4), icon[0].slice(2)];
	});

webfont({
	files: "svg/**/*.svg",
	fontName: "file-icons",
	glyphTransformFn: (obj) => {
		const icon = icons.find((icon) => icon[0] === obj.name);
		if (icon) {
			obj.unicode = [String.fromCodePoint(parseInt(icon[1], 16))];
		}
		return obj;
	},
})
	.then((result) => {
		if (result.woff2) {
			fs.writeFileSync(
				path.resolve(
					__dirname,
					"dist",
					`${result.config?.fontName}.woff2`
				),
				result.woff2
			);
		}
	})
	.catch((error) => {
		throw error;
	});
