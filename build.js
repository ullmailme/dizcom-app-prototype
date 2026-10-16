// Собирает прототип в один файл. Запуск: node build.js [путь для варианта под публикацию]
const fs = require("fs"), path = require("path");
const rd = f => fs.readFileSync(path.join(__dirname, "src", f), "utf8");
const inline = html => html
  .replace('<link rel="stylesheet" href="styles.css">', () => "<style>\n" + rd("styles.css") + "\n</style>")
  .replace('<script src="data.js"></script>', () => "<script>\n" + rd("data.js") + "\n</script>")
  .replace('<script src="app.js"></script>', () => "<script>\n" + rd("app.js") + "\n</script>");
const [head, body] = rd("index.html").split("<!--BODY-->");
const full = inline(`<!doctype html>\n<html lang="ru">\n<head>\n${head}</head>\n<body>${body}</body>\n</html>\n`);
fs.writeFileSync(path.join(__dirname, "DizCom-APP.html"), full);
fs.writeFileSync(path.join(__dirname, "index.html"), full); // та же страница под именем для GitHub Pages
console.log("DizCom-APP.html и index.html", full.length, "байт");
if (process.argv[2]) { const frag = inline(head + body); fs.writeFileSync(process.argv[2], frag); console.log("для публикации:", process.argv[2], frag.length, "байт"); }
