// src/index.ts
function demoLoader(content) {
  const options = this.getOptions();
  const filePath = this.resourcePath;
  const componentNames = options.componentNames;
  const contentSplit = content.split(/\n/);
  const matchedPositions = [];
  const compNames = componentNames.map((name, index) => `(${name})${index + 1 !== componentNames.length ? "|" : ""}`).join("");
  const reactCompRegExp = new RegExp(`<(${compNames})+\\s*`, "g");
  contentSplit.forEach((eachLine, line) => {
    const char = eachLine.search(reactCompRegExp);
    if (char > -1) {
      matchedPositions.push({
        line: line + 1,
        char: char + 1
      });
    }
  });
  let i = 0;
  return content.replace(reactCompRegExp, (matchString) => {
    const { line, char } = matchedPositions[i];
    const subString = `${matchString} 
        onContextMenu= {(e) => {
            if(e.shiftKey){
                e.preventDefault();
                window.open('vscode://file/${filePath}:${line}:${char}')
            }
        }}`;
    i++;
    return subString;
  });
}
module.exports = demoLoader;
