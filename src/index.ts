function codeNavigationLoader(content:string) {
  const options:{
    componentNames:string[]
  } = this.getOptions() // 获取 options
  const filePath = this.resourcePath // 获取 对应文件路径

  const componentNames = options.componentNames
  const contentSplit = content.split(/\n/).map((str) => `${str}\n`)
  const matchedPositions:{line:number,char:number}[] = []
  const compNames = componentNames
    .map((name, index) => `(${name})${index + 1 !== componentNames.length ? '|' : ''}`)
    .join('')
  const reactCompRegExp = new RegExp(`<(${compNames})+(?=(\\s|>))`, 'g')

  contentSplit.forEach((eachLine, line) => {
    const char = eachLine.search(reactCompRegExp) // 匹配所有未被注释的组件开头。如，<Button
    if (char > -1) {
      matchedPositions.push({
        line: line + 1, // 字符纵向位置
        char: char + 1, // 字符横向位置
      })
    }
  })
  let i = 0
  return content.replace(reactCompRegExp, (matchString) => {
    const { line, char } = matchedPositions[i]
    const subString = `${matchString} 
        onContextMenu= {(e) => {
            if(e.shiftKey){
                e.preventDefault();
                window.open('vscode://file/${filePath}:${line}:${char}')
            }
        }}`
    i++
    return subString
  })
}

module.exports = codeNavigationLoader