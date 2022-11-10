var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => codeNavigationLoader
});
module.exports = __toCommonJS(src_exports);
function codeNavigationLoader(content) {
  const options = this.getOptions();
  const filePath = this.resourcePath;
  const componentNames = options.componentNames;
  const contentSplit = content.split(/\n/).map((str) => `${str}
`);
  const matchedPositions = [];
  const compNames = componentNames.map((name, index) => `(${name})${index + 1 !== componentNames.length ? "|" : ""}`).join("");
  const reactCompRegExp = new RegExp(`<(${compNames})+(?=(\\s|>))`, "g");
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
                e.stopPropagation();
                window.open('vscode://file/${filePath}:${line}:${char}')
            }
        }}`;
    i++;
    return subString;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
