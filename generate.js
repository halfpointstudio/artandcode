import fs from 'fs'
import { formatDate, sortKVPair } from './utils.js'

const dir = './programs'

const metaFile = 'metadata.json'
const metaFilePath = `./${metaFile}`

const exportFile = 'programs.js'
const exportFilePath = `${dir}/${exportFile}`

let scriptString = ''

function getMetaData(path) {
    let data
    try {
        data = fs.readFileSync(path, 'utf-8')
    } catch (err) {
        data = JSON.stringify({})
    }
    return JSON.parse(data)
}

let metaData = getMetaData(metaFilePath)

fs.readdirSync(dir).forEach(file => {
    if (file == exportFile) return
    if (!(file in metaData)) {
        metaData[file] = formatDate(Date.now(), 'u')
        console.info(`New File Detected: ${file}`, metaData[file])
    }
    scriptString += `export * from './${file}'\n`
})

function override(name, dt) {
    if (!(name in metaData)) return
    metaData[name] = formatDate(dt, 'u')
}
function copy(src, dst) {
    if (!(src in metaData)) return
    metaData[dst] = metaData[src]
}
function move(src, dst) {
    if (!(src in metaData)) return
    copy(src, dst)
    delete metaData[src]
}
// move(
//     'grow.js',
//     'back_to_basics.js',
// )
// override(
//     'back_to_basics.js',
//     'February 20 2024 17:45' +
//     // `:${new Date().getHours()}` +
//     // `:${new Date().getMinutes()}` +
//     `:${new Date().getSeconds()}`
// )

function sortMetaData(md, reverse=false) {
    return sortKVPair(md, reverse)
}
metaData = sortMetaData(metaData)

// console.log(Object.entries(metaData).reduce((acc, [k, v]) => {
//     acc[k] = formatDate(v, 'dt')
//     return acc
// }, {}))

// console.info(scriptString)
// console.info(metaData)

fs.writeFileSync(exportFilePath, scriptString)
fs.writeFileSync(metaFilePath, JSON.stringify(metaData))
console.info('Done!')

export {
    getMetaData,
    sortMetaData
}
