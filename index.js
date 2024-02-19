import * as fns from './programs/programs.js'
import { migrateToObj } from './utils.js'

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

    const scale = window.devicePixelRatio
    canvas.width = canvas.width * scale
    canvas.height = canvas.height * scale

    ctx.scale(scale, scale)
    ctx.imageSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    ctx.msImageSmoothingEnabled = false

    window.requestAnimationFrame(() => 
        draw(ctx, canvas.width, canvas.height)
    )
}

window.addEventListener('resize', resize, true)
resize()

function setup(fns, ctx, w, h) {

    this.fns = fns
    this.ctx = ctx
    this.w = w
    this.h = h

    const render = (self) => {
        let fn
        if (!('prog' in this.fns[self.name])) {
            fn = migrateToObj(this.fns[self.name])
        } else {
            fn = this.fns[self.name]
        }
        fn.prog(this.ctx, this.w, this.h)
    }

    this.randomise = () => {
        let name = Object.keys(this.fns)[
            Math.floor(Math.random() * Object.keys(this.fns).length)
        ]
        this.render = () => { render({name: name}) }
    }

    this.latest = () => {
        // TODO: add meta filtering here based on dates
        let name = Object.keys(this.fns)[0]
        this.render = () => { render({name: name}) }
    }

    this.override = (name) => {
        this.render = () => { render({name: name}) }
    }
}

function draw(ctx, w, h) {
    ctx.save()

    const listOfFns = fns
    const fn = new setup(listOfFns, ctx, w, h)

    // fn.randomise()
    // fn.latest()
    fn.override('circles')
    fn.render()

    ctx.restore()
}
