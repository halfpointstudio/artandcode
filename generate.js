import fs from 'fs'
import { formatDate } from './utils.js'

const dir = './programs'

const metaFile = 'metadata.json'
const metaFilePath = `./${metaFile}`

const exportFile = 'programs.js'
const exportFilePath = `${dir}/${exportFile}`

let scriptString = ''
let metaData = null


try {
    metaData = fs.readFileSync(metaFilePath, 'utf-8')
} catch (err) {
    metaData = JSON.stringify({})
}
metaData = JSON.parse(metaData)


fs.readdirSync(dir).forEach(file => {
    if (file == exportFile) return
    if (!(file in metaData)) {
        metaData[file] = formatDate(Date.now(), 'u')
    }
    scriptString += `export * from './${file}'\n`
})

function override(name, dt) {
    if (!(name in metaData)) return
    metaData[name] = formatDate(dt, 'u')
}
// override(
//     'ripple.js',
//     'January 21 2024 22' +
//     // `:${new Date().getHours()}` +
//     `:${new Date().getMinutes()}` +
//     `:${new Date().getSeconds()}`
// )

metaData =  Object.entries(metaData)
.sort(([,a], [,b]) => a-b)
.reduce((acc, [k, v]) => ({...acc, [k]: v}), {})

// console.log(Object.entries(metaData).reduce((acc, [k, v]) => {
//     acc[k] = formatDate(v, 'dt')
//     return acc
// }, {}))

// console.info(scriptString)
// console.info(metaData)

fs.writeFileSync(exportFilePath, scriptString)
fs.writeFileSync(metaFilePath, JSON.stringify(metaData))
console.info('Done!')


