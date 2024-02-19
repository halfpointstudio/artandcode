function draw(rules) {
    const ctx = rules.canvas.ctx
    const w = rules.canvas.w
    const h = rules.canvas.h

    ctx.clearRect(0, 0, w, h)

    ctx.save()
    ctx.fillStyle = `hsl(${rules.hue}, 40%, 90%, 1)`
    ctx.fillRect(0, 0, w, h)
    ctx.restore()



    let randomness = {
        x: rules.abnormality.x*10,
        y: rules.abnormality.y*1000,
    }
    // ctx.beginPath()
    // ctx.lineWidth = 1
    // ctx.strokeStyle = `hsl(${rules.hue}, 15%, 55%, 1)`
    // for(let i=0; i<rules.num; i++) {
    //     ctx.arc(
    //         w/2, h/2, rules.radius,
    //         (2*Math.PI/rules.num)*(i) + randomness.x,
    //         (2*Math.PI/rules.num)*(i+1) + randomness.x
    //     )
    // }
    // ctx.closePath()
    // ctx.stroke()

    for (let data of rules.controlpoints) {
        ctx.save()
        ctx.strokeStyle = `hsl(${rules.hue}, 33%, 33%, 1)`
        ctx.beginPath()
        ctx.arc(w/2, h/2, data[2], 0, 2*Math.PI )
        ctx.stroke()
        ctx.restore()
    }

    for (let [ind, center] of Object.entries(rules.circlepoints)) {
        
        ctx.save()

        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = `hsl(${rules.hue}, 35%, 55%, .5)`
        ctx.arc(center.x, center.y, rules.radius, 0, 2 * Math.PI * 1)
        ctx.fill()
        ctx.restore()


        ctx.clip()
        console.log(rules.controlpoints)
        for (let data of rules.controlpoints) {

            const point = data[0]
            const num = data[1]
            for(let i=0; i<num; i++) {
                ctx.lineWidth = 5
                ctx.strokeStyle = `hsl(${rules.hue}, 40%, 80%, 1)`
                ctx.beginPath()
                ctx.moveTo(point.x, point.y)
                ctx.lineTo(
                    angleToCoords(center.x, center.y, (2*Math.PI/num)*i + randomness.x, rules.radius).x,
                    angleToCoords(center.x, center.y, (2*Math.PI/num)*i + randomness.x, rules.radius).y,
                )
                ctx.stroke()

                ctx.lineWidth = 3
                ctx.strokeStyle = `hsl(${rules.hue}, 0%, 100%, .9)`
                ctx.beginPath()
                ctx.moveTo(
                    angleToCoords(center.x, center.y, (2*Math.PI/num)*i + randomness.x, rules.radius).x,
                    angleToCoords(center.x, center.y, (2*Math.PI/num)*i + randomness.x, rules.radius).y,
                )
                ctx.lineTo(point.x, point.y)
                ctx.stroke()

                ctx.lineWidth = 1
                ctx.strokeStyle = `hsl(${rules.hue}, 100%, 0%, .9)`
                ctx.beginPath()
                ctx.moveTo(
                    angleToCoords(center.x, center.y, (2*Math.PI/num)*i + randomness.x, rules.radius).x,
                    angleToCoords(center.x, center.y, (2*Math.PI/num)*i + randomness.x, rules.radius).y,
                )
                ctx.lineTo(point.x, point.y)
                ctx.stroke()
            }
        }

        ctx.restore()

    }
    window.requestAnimationFrame(() => {

        // rules.update('time', 1)
        // rules.update2D('abnormality', {
        //     x: ((Math.random() * -2) + 1)/500,
        //     y: ((Math.random() * -2) + 1)/500,
        // })

        // draw(rules)
    })

}
function angleToCoords(c1, c2, angle, radius) {
    const coords = {
        x: c1 + Math.cos(angle) * radius,
        y: c2 + Math.sin(angle) * radius
    }
    return coords
}

function circles(ctx, w, h) {
    const rules = new Rules(ctx, w, h)
    rules.store({radius: w/2, color: [0, 55, 45], num: 5})

    rules.enable('hue', Math.floor(Math.random() * 360))
    rules.enable('radius', w/2*.5)
    rules.enable('circlepoints', Array.from(
        {length: 1},
        (_, i) => {
            // return {
            //     x: (Math.random() * 2 - 1) * w/3 + w/2,
            //     y: (Math.random() * 2 - 1) * h/3 + h/2,
            // }
            return {
                x: w/2,
                y: h/2
            }}
    ))
    rules.enable('controlpoints', Array.from(
        {length: (Math.random() * 100 + 1)},
        // {length: 1000},
        (_, i) => {
            const rad = (Math.random() + .3) * w/2
            return [
                angleToCoords(w/2, h/2, 2*Math.PI * Math.random(), rad),
                // Math.floor(Math.random() * 1 * (i + 1))+2,
                3,
                rad
            ]}
    ))

    draw(rules)
}

class Rules {
    constructor(ctx, w, h) {
        this.canvas = {
            ctx: ctx,
            w: w,
            h: h,
        }
        this.time = 0
        this.abnormality = {
            x: (Math.random() * -2) + 1,
            y: (Math.random() * -2) + 1,
        }
    }

    enable(key, value) {
        if (!value) {
            value = this._calldefaults(key)
        }
        this[key] = value
    }

    store(config) {
        this.defaults = config
        if ('color' in this.defaults) {
            this.defaults.hue = config.color[0]
            this.defaults.sat = config.color[1]
            this.defaults.light = config.color[2]
        }
    }

    _calldefaults(key) {
        if (key in this.defaults) {
            return this.defaults[key]
        }
        console.error(`This ${key} is not present in defaults, setting it to null`)
        return null
    }

    _defaultHSB() {
        if ('color' in this.defaults) {
        
        }
    }

    update(key, delta) {
        this[key] += delta
    }

    update2D(key, delta) {
        Object.keys(this[key]).forEach((k) => {
            this[key][k] += delta[k]
        })
    }

    override(key, value) {
        if (!(key in this)) return
        this[key] = value
    }
}

export {
    circles
}
