import { Helper, Rules } from "../utils"

class Bar {
    constructor(canvas, [x, y, w, h]) {
        this.ctx = canvas.ctx,
        this.container = {
            w: canvas.w,
            h: canvas.h,
        }

        this.pos = {
            x: x,
            y: y,
        },
        this.dims = {
            w: w,
            h: h,
        }
    }

    shape() {
        this.ctx.fillRect(
            this.pos.x, 
            this.pos.y,
            - this.dims.w,
            - this.dims.h,
        )
    }

    shadow() {
        const [tx, ty] = [
            this.pos.x, 
            this.pos.y,
        ]
        this.ctx.translate(tx, ty)
        this.ctx.transform(1, 0, Math.tan(75 * Math.PI/180), 1, 0, 0)
        this.ctx.translate(-1 * tx, -1 * ty)
        this.ctx.fillRect(tx, ty, -this.dims.w, -this.dims.h*.3)
    }
}

class CustomHelper extends Helper {
    constructor(ctx, w, h) {
        super(ctx, w, h)
    }

    applyGrid(section, canvas) {
        
        for (let iy=0;iy<section.grid.y;iy++) {
            for (let ix=0;ix<section.grid.x;ix++) {
                const coords = {
                    x: section.initial.x + (ix * section.gap.x),
                    y: section.initial.y + (iy * (section.shape.h + section.gap.y)),
                }

                const bar = new Bar(canvas, [
                    coords.x,
                    coords.y,
                    section.shape.w,
                    section.shape.h,
                ])

                this.ctx.save()
                // this.ctx.globalCompositeOperation = 'multiply'
                bar.shadow()
                this.ctx.restore()

                this.ctx.save()
                this.ctx.fillStyle = `hsl(${section.hue}, 45%, 55%, .5)`
                bar.shape()
                this.ctx.restore()

            }
        }
    }

}

function draw(rules, helper) {
    const [ctx, w, h] = Object.values(rules.canvas)
    ctx.clearRect(0, 0, w, h)

    ctx.save()
    ctx.fillStyle = 'hsl(0, 0%, 20%, 1)'
    helper._applyBG()
    ctx.restore()

    ctx.translate(w/2, h/2)
    ctx.rotate(rules.rotation * Math.PI/180)
    ctx.translate(-w/2, -h/2)

    helper.applyGrid(rules.left, rules.canvas)
    helper.applyGrid(rules.right, rules.canvas)

}

function small_and_big(ctx, w, h) {
    console.log('small and big')
    const rules = new Rules(ctx, w, h)
    const helper = new CustomHelper(ctx, w, h)

    rules.enable('hue', 0, 360)
    rules.enable('rotation', helper.rng(-60, 60))

    rules.enable('left', {
        hue: helper.rng(0, 360),
        color: helper.randomHSLA(),
        grid: {
            x: 25,
            y: 25,
        },
        shape: {
            w: 8,
            h: 120,
        },
        gap: {
            x: 30,
            y: 35,
        }
    })
    rules.left.initial = {
        // x: 50,
        // y: rules.left.gap.y + rules.left.shape.h,
        x: -200,
        y: -100,
    }

    rules.enable('right', {
        hue: rules.left.hue + 90,
        grid: {
            x: 25,
            y: 25,
        },
        shape: {
            w: 8,
            h: 20,
        },
        gap: {
            x: 45,
            y: 35,
        }
    })
    rules.right.initial = {
        x: w * .5 + 55,
        // y: rules.right.gap.y + rules.right.shape.h,
        y: -100,
    }

    draw(rules, helper)
}

export {
    small_and_big
}
