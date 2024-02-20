import fs from 'fs'
import { formatDate } from './utils.js'

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

function sortMetaData(md, reverse=false) {
    if (reverse) {
        return Object.entries(md)
            .sort(([,a], [,b]) => b-a)
            .reduce((acc, [k, v]) => ({...acc, [k]: v}), {})
    } else {
        return Object.entries(md)
            .sort(([,a], [,b]) => a-b)
            .reduce((acc, [k, v]) => ({...acc, [k]: v}), {})
    }
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
