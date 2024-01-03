import fs from 'fs'

const dir = './programs'
const exportFile = 'programs.js'
const exportFilePath = `${dir}/${exportFile}`
let scriptString = ''

fs.readdirSync(dir).forEach(file => {
    if (file == exportFile) return
    scriptString += `export * from './${file}'\n`
})

console.log(scriptString)
fs.writeFileSync(exportFilePath, scriptString)


