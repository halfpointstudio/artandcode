import { Helper, Rules } from "../utils"

const rules = new Rules()
const helper = new Helper()

function fluidCube() {
    // const size, x, y
    const [ctx, w, h] = Object.values(rules.canvas)
    const size = 100
    let x = (w - size)/2
    let y = (h - size)/2
    console.log(x, y)

    helper.toIsometricProjection(w/2, h/2)
    const d = {}
    const gap = 10
    const layers = 8
    for (let iy=0;iy<=layers;iy++) {
        // d.w = (helper.uintCos(iy/layers + rules.time/20)+.5) * size
        // d.h = (helper.uintCos(iy/layers + rules.time/20)+.5) * size
        d.w = helper.uintCos(iy/8) * size
        d.h = helper.uintCos(iy/8) * size
        d.x = x - iy * gap + (size - d.w)/2
        d.y = y + iy * gap + (size - d.h)/2

        ctx.fillStyle = `hsl(100, 45%, 55%, .3)`
        ctx.fillRect(d.x, d.y, d.w, d.h)
    }
}

class FluidCube {
    constructor(ctx, cell, meta) {
        this.ctx = ctx,
        this.parent = JSON.parse(JSON.stringify(cell))
        this.shape = JSON.parse(JSON.stringify(meta))
        this._compute()
    }

    _compute() {
        this.dims = {
            w: this.shape.size * this.parent.w,
            h: this.shape.size * this.parent.h,
        }

        this.center = {
            x: this.parent.w/2 + this.parent.x,
            y: this.parent.h/2 + this.parent.y,
        }

        this.x = this.center.x - this.dims.w/2
        this.y = this.center.y - this.dims.h/2

        // this.color = `hsl(100, 45%, 55%, .3)`
        this.color = helper.getHSLA(this.shape.color)

    }

    _calcLayer(ind, t=0) {
        const d = {}
        const angle = {
            w: ind/this.shape.layers*1 + this.shape.entry + t,
            h: ind/this.shape.layers*1 + this.shape.entry + t,
        }
        d.w = (helper.uintCos(angle.w)+.5) * this.dims.w
        d.h = (helper.uintCos(angle.h)+.5) * this.dims.h
        d.x = this.x - (ind * this.shape.gap) + (this.dims.w - d.w)/2
        d.y = this.y + (ind * this.shape.gap) + (this.dims.h - d.h)/2
        return d
    }

    _drawLayer(d) {
        this.ctx.fillRect(d.x, d.y, d.w, d.h)
    }

    _shape(t=0) {
        helper.toIsometricProjection(...Object.values(this.center))
        // for (let iy=-this.shape.layers/2;iy<=this.shape.layers/2;iy++) {
        // for (let iy=0;iy<=this.shape.layers;iy++) {
        for (let iy=-this.shape.layers;iy<=0;iy++) {
            const d = this._calcLayer(iy, t)
            this.ctx.save()
            this.ctx.fillStyle = this.color
            this._drawLayer(d)
            this.ctx.restore()
        }
    }

    _shadow(t=0) {

        const [tx, ty] = [
            this.x,
            this.y,
        ]
        this.ctx.translate(tx, ty)
        // this.ctx.transform(1, 0, Math.tan(100 * Math.PI/180), 1, 0, 0)
        this.ctx.scale(1, -1)
        this.ctx.transform(1, 0, 0, 1, 0, -this.dims.h)
        helper.shearX(-75)
        this.ctx.translate(-1 * tx, -1 * ty)
    
        this.ctx.fillStyle = this.color
        for (let iy=0;iy<=this.shape.layers;iy++) {
            const d = this._calcLayer(iy, t)
            this._drawLayer(d)
        }
        
    }

    render() {

        this.ctx.save()
        this._shape()
        this.ctx.restore()

        this.ctx.save()
        this._shadow()
        this.ctx.restore()
    }

    animate() {
        this.ctx.save()
        this._shape(rules.time/100)
        this.ctx.restore()

        this.ctx.save()
        this._shadow(rules.time/100)
        this.ctx.restore()

        // this._shape(rules.time/100)
        // this._shadow(rules.time/100)
    }
}


function draw() {
    const [ctx, w, h] = Object.values(rules.canvas)
    helper._clear()
    helper._reset()

    ctx.save()

    // ctx.save()
    // ctx.fillStyle = 'black'
    // helper._applyBG()
    // ctx.restore()

    ctx.save()

    let nxcells = rules.grid.size.x
    let nycells = rules.grid.size.y

    const cell = {}
    cell.w = w/nxcells
    cell.h = h/nycells

    let count = 0
    for(let iy=0; iy<nycells; iy++) {
        for(let ix=0; ix<nxcells; ix++) {

            cell.x = ix * cell.w
            cell.y = iy * cell.h

            ctx.save()
            const cube = new FluidCube(ctx, cell, rules.shapes[count])
            // cube.render()
            cube.animate()
            ctx.restore()
            count += 1
        }
    }

    for(let iy=0; iy<nycells+1; iy++) {
        for(let ix=0; ix<nxcells+1; ix++) {

            cell.x = ix * cell.w - (cell.w)/2
            cell.y = (iy - .5) * cell.h

            ctx.save()
            const cube = new FluidCube(ctx, cell, rules.shapes[count])
            // cube.render()
            cube.animate()
            ctx.restore()
            count += 1
        }
    }

    // ctx.save()
    // fluidCube()
    // ctx.restore()

    ctx.restore()


    window.requestAnimationFrame(() => {
        rules._next()
        draw()
    })

}

function stacked(ctx, w, h) {
    rules.init(ctx, w, h)
    helper.init(ctx, w, h)

    rules.enable('grid', {
        size: {
            x: 30,
            y: 30,
        }
    })

    rules.enable('shapes',
        Array.from(
            {length: 
                (rules.grid.size.x * rules.grid.size.y) + 
                (rules.grid.size.x + 1) * (rules.grid.size.y + 1)
            },
            () => ({
                color: [
                    helper.rng(0, 360),
                    45, 55,
                    helper.rng(1, 6)/10
                ],
                gap: helper.rng(5, 10),
                size: helper.rng(10, 30)/100,
                layers: helper.rng(5, 20),
                entry: helper.rng(0, 50)
            })
        )
    )

    draw()
}


export {
    stacked
}
