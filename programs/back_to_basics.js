import { Helper, Rules } from "../utils"

class CustomRules extends Rules {
    impact(key, value, impactedKeys) {
        this.enable(key, value)
        console.log(impactedKeys)
        impactedKeys.forEach((k) => {
            this[k] *= value
        })
    }

    enable(key, ...rest) {
        let v = rest[0]
        if (rest.length > 1) {
            v = Math.floor((Math.random() * rest[1]) + rest[0])
        }
        super.enable(key, v)
    }

    override(key, ...rest) {
        let v = rest[0]
        if (rest.length > 1) {
            v = Math.floor((Math.random() * rest[1]) + rest[0])
        }
        super.override(key, v)
    }
}

class CustomHelper extends Helper {
    constructor() {
        super()
        this.contained = {
            w: null,
            h: null,
        }
    }

    setBoundaries(x, y, w, h) {
        this.contained.x = x
        this.contained.y = y
        this.contained.w = w
        this.contained.h = h
    }

    *getBoundaries() {
        yield this.contained.x
        yield this.contained.y
        yield this.contained.w - this.contained.x
        yield this.contained.h - this.contained.y
    }

    getRandomX(a=0, b=1) {
        return super.rng(
            this.contained.w * a + this.contained.x,
            this.contained.w * b,
        )
    }

    getRandomY(a=0, b=1) {
        return super.rng(
            this.contained.h * a + this.contained.y,
            this.contained.h * b,
        )
    }
}

function draw(helper, rules) {
    const ctx = rules.canvas.ctx
    const w = rules.canvas.w
    const h = rules.canvas.h

    ctx.clearRect(0, 0, w, h)

    rules.override('hue', 204)
    ctx.save()
    ctx.fillStyle = `hsl(${rules.hue}, 20%, 30%, 1)`
    ctx.fillRect(0, 0, w, h)
    ctx.restore()

    rules.override('hue', 59)
    for (let iy=0;iy<10;iy++) {
        for (let ix=0;ix<30;ix++) {
            let dims = {
                w: 20,
                h: 50 + (iy * 5)
            }
            let coords = {
                x: ix * 50,
                y: iy * 100
            }
            ctx.save()
            ctx.fillStyle = `hsl(${rules.hue}, 1%, 45%, .1)`
            ctx.translate(w/2, h/2)
            ctx.rotate((180 * Math.PI) / 180)
            ctx.translate(-w/2, -h/2)
            ctx.fillRect(
                coords.x,
                coords.y,
                dims.w, dims.h
            )
            ctx.restore()
        }
    }

    for (let iy=0;iy<9;iy++) {
        for (let ix=0;ix<9;ix++) {
            let dims = {
                w: (rules['shape.w'] + 5) - (ix*1.5),
                h: rules['shape.h'] + (iy * 5)
            }
            let coords = {
                x: rules.initial.x + (ix * rules['shape.x.gap']),
                y: rules.initial.y + (iy * rules['shape.y.gap'])
            }

            if (rules.isLeft) {
                ctx.save()
                ctx.fillStyle = `hsl(${rules.hue}, 80%, 82%, .3)`
                ctx.fillRect(
                    coords.x, coords.y,
                    dims.w, dims.h
                )
                ctx.restore()
            }

            if (rules.isRight) {
                ctx.save()
                ctx.scale(-1, 1)
                if (rules.isRightRotated) {
                    ctx.translate(
                        -w+coords.x,
                        coords.y,
                    )
                    ctx.rotate(((45-iy)*Math.PI)/180)
                    ctx.translate(
                        -1 * (-w+coords.x),
                        -1 * (coords.y),
                    )
                }
                ctx.fillStyle = `hsl(${rules.hue}, 80%, 82%, .9)`
                ctx.fillRect(
                    -w + coords.x,
                    coords.y,
                    dims.w, dims.h
                )
                ctx.restore()
            }

            if (rules.isLeftBorder) {
                ctx.save()
                if (rules.isLeftBorderRotated) {
                    ctx.translate(
                        coords.x,
                        coords.y + 1,
                        dims.w,
                        dims.h - 2
                    )
                    ctx.rotate(((45-iy-(ix*4))*Math.PI)/180)
                    ctx.translate(
                        -1 * (coords.x),
                        -1 * (coords.y + 1),
                        -1 * (dims.w),
                        -1 * (dims.h - 2),
                    )
                }

                ctx.save()
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.strokeStyle = `hsl(${rules.hue}, 100%, 40%, 1)`
                ctx.rect(
                    coords.x,
                    coords.y + 1,
                    dims.w,
                    dims.h - 2
                )
                ctx.stroke()
                ctx.restore()

                ctx.save()
                ctx.beginPath()
                ctx.lineWidth = 1.5
                ctx.strokeStyle = `hsl(${rules.hue}, 0%, 100%, 1)`
                ctx.rect(
                    coords.x,
                    coords.y + 1,
                    dims.w,
                    dims.h - 2
                )
                ctx.stroke()
                ctx.restore()

            }
            ctx.restore()
        }
    }

    // const bounds = helper.getBoundaries()
    // const region = new Path2D()
    // region.rect(
    //     bounds.next().value,
    //     bounds.next().value,
    //     bounds.next().value,
    //     bounds.next().value
    // )
    // ctx.clip(region)

    // ctx.save()
    // const gap = 50
    // for (let iy=0; iy<10; iy++) {
    //     rules.update2D('abnormality', {
    //         x: ((Math.random() * -2) + 1),
    //         y: ((Math.random() * -2) + 1),
    //     })
    //     console.log(rules.abnormality)

    //     for(let ix=0; ix<100; ix++) {
    //         ctx.fillStyle = `hsl(59, 80%, 82%, 1)`
    //         let dims = {
    //             w: 10,
    //             h: Math.sin(ix/9 * Math.PI * 2 + (rules.abnormality.y * 100)) * 100
    //         }
    //         let coords = {
    //             x: rules.initial.x + (20 * ix),
    //             y: rules.initial.y + (100 - dims.h)/2 + (iy * 90),
    //         }

    //         ctx.rect(coords.x, coords.y, dims.w, dims.h)
    //         ctx.fill()
    //     }
    // }
    // ctx.restore()
}

function back_to_basics(ctx, w, h) {
    const rules = new CustomRules(ctx, w, h)
    const helper = new CustomHelper()
    helper.setBoundaries(100, 100, w*.9, h*.9)

    rules.enable('initial', {
        x: helper.getRandomX(0, .7),
        y: helper.getRandomY(),
    })
    rules.enable('initial', {
        x: 75,
        y: 50
    })

    rules.enable('hue', 0, 360)
    rules.enable('shape.w', 20)
    rules.enable('shape.h', 50)
    rules.enable('shape.x.gap', 50)
    rules.enable('shape.y.gap', 100)

    rules.enable('isLeft', Math.round(Math.random()))
    rules.enable('isLeftBorder', Math.round(Math.random()))
    rules.enable('isLeftBorderRotated', Math.round(Math.random()))
    rules.enable('isRight', Math.round(Math.random()))
    rules.enable('isRightRotated', Math.round(Math.random()))



    draw(helper, rules)
}

export {
    back_to_basics
}
