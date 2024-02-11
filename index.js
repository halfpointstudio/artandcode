import * as fns from './programs/programs.js'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
document.getElementById('canvas').appendChild(canvas)

function resize() {
    const parent = document.querySelector('section#canvas')
    console.log(parent.offsetWidth, parent.offsetHeight)
    const size = Math.min(parent.offsetWidth, parent.offsetHeight) * .9
    canvas.style.width = size
    canvas.style.height = size

    canvas.width = Math.ceil(size / 1000) * 1000
    canvas.height = Math.ceil(size / 1000) * 1000

    window.requestAnimationFrame(() => 
        draw(ctx, canvas.width, canvas.height)
    )
}

window.addEventListener('resize', resize, true)
resize()

function draw(ctx, w, h) {
    ctx.save()

    fns[Object.keys(fns)[
        Math.floor(Math.random() * Object.keys(fns).length)
    ]](ctx, w, h)
    // fns['loading'](ctx, w, h)

    ctx.restore()
}
