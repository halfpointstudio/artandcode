import fs from 'fs'

const dir = './programs'
const exports = {
    parent: {
        name: './archive'
    },
    html: {
        name: 'archive.html',
    },
    js: {
        name: '',
    },
    css: {
        name: 'style.css',
    },
}

const programStringT = fs.readFileSync('template-program.html', 'utf-8')
let contentString = ''
fs.readdirSync(dir).forEach(file => {
    if (file == 'programs.js') return
    contentString += wrapAroundRow(file)
    let programString = replace(
        programStringT, 
        { 
            f: 'cssFile',
            v: `../${exports.css.name}`
        }
    )
    programString = replace(
        programString, 
        { 
            f: 'title',
            v: `${file.replace('.js', '')}`
        }
    )
    programString = replace(
        programString, 
        { 
            f: '0',
            v: `'${file.replace('.js', '')}'`
        }
    )
    fs.writeFileSync(
        `${exports.parent.name}/${file.replace('.js', '.html')}`,
        programString
    )
    
})

const archiveStringT = fs.readFileSync('template-archive.html', 'utf-8')
let archiveString = ''
archiveString = replace(
    archiveStringT,
    { 
        f: 'cssFile',
        v: exports.css.name
    }
)
archiveString = replace(
    archiveString, 
    { 
        f: 'jsFile',
        v: exports.js.name
    }
)
archiveString = replace(
    archiveString, 
    { 
        f: '0',
        v: contentString
    }
)

fs.writeFileSync(
    `./${exports.html.name}`,
    archiveString
)

function replace(dst, patch) {
    // f => what to [f]ind, v => which [v]alue to use
    let pattern = `"{${patch.f}}"`
    dst = dst.replace(pattern, patch.v)
    return dst
}

function capitalize(s) {
    // TODO: capitalize first letter of the word
    return s
}

function wrapAroundRow(f) {
    f = f.replace('.js', '')
    const str = `
    <div id='${f}' class='program'> Link to <a href='./archive/${f}.html'> 
    ${capitalize(f.replace('_', ' '))} </a></div>
    `
    return str
}
