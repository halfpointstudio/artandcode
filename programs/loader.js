function give_me_center(dims, obj) {
    if (!obj) {
        obj = {
            w: 0,
            h: 0
        }
    }
    return {
        x: dims.w / 2 - (obj.w / 2),
        y: dims.h / 2 - (obj.h / 2)
    }
}

function clear(ctx, area) {
    ctx.clearRect(area.x, area.y, area.w, area.h)
}

function iterate(rules) {
    rules.t += 1
}

function newRound(rules) {
    rules.t = 0
    rules.color.h = Math.random() * 360
}

function calcPerc(v, s) {
    return v/100 * s
}

function calcAngle(a, q) {
    return 2*Math.PI*a*q
}

class Loaders {
    constructor(name) {
        this.type = name
        this.values = {}
        this.container = {}
        this.perc = 0
        this.rules = this.calcRules()
        this.rotation = ['default', 'circle', 'dots']
        this.rotation = this.rotation.filter((x) => x != this.type)
        this.rotation.push(this.type)
    }

    calcRules() {
        return this.defaultRules()
        // if (this.type == 'default') {
        //     return this.defaultRules()
        // }
    }

    defaultRules() {
        const values = {}
        values.t = 0
        values.speed = 0.5
        values.rect = {
            x: 10,
            y: 10,
            w: 300,
            h: 20,
        }
        values.color = {
                h: 100,
                s: 65,
                l: 45,
                a: 1,
        }
        return values
    }

    defaultDraw(ctx) {
        const rect = this.rules.rect
        const c = this.rules.color
        const coords = give_me_center({w: this.container.w, h: this.container.h}, rect)
        this.perc = calcPerc(this.rules.t, this.rules.speed)
        ctx.fillStyle = `hsl(${c.h}, ${c.s}%, ${c.l}%, ${c.a * this.perc})`
        ctx.fillRect(
            coords.x,
            coords.y,
            rect.w * this.perc,
            rect.h
        )
    }

    dotsDraw(ctx) {
        const rect = this.rules.rect
        const c = this.rules.color
        const coords = give_me_center({w: this.container.w, h: this.container.h}, rect)
        this.perc = calcPerc(this.rules.t, this.rules.speed)
        for (let ix=0;ix<10*this.perc;ix++) {
            ctx.fillStyle = `hsl(${c.h}, ${c.s}%, ${c.l}%, ${c.a * calcPerc(this.rules.t, this.rules.speed*0.8)})`
            ctx.beginPath()
            ctx.arc(
                coords.x + (ix * rect.w/10),
                coords.y,
                rect.h*.5,
                0,
                calcAngle(1, 1)
            )
            ctx.fill()
        }
    }

    circleDraw(ctx) {
        const rect = this.rules.rect
        const c = this.rules.color
        const coords = give_me_center({w: this.container.w, h: this.container.h}, null)
        this.perc = calcPerc(this.rules.t, this.rules.speed)
        ctx.fillStyle = `hsl(${c.h}, ${c.s}%, ${c.l}%, ${c.a * this.perc})`
        ctx.beginPath()
        ctx.arc(
            coords.x,
            coords.y,
            rect.w*.5,
            0,
            calcAngle(this.perc, 1)
        )
        ctx.arc(
            coords.x,
            coords.y,
            rect.w*.5-rect.h,
            calcAngle(this.perc, 1),
            0,
            true
        )
        ctx.closePath()
        ctx.fill()
    }

    draw(ctx) {
        ctx.save()
        if (this.type == 'default') {
            this.defaultDraw(ctx)
        } else if (this.type == 'dots') {
            this.dotsDraw(ctx)
        } else if (this.type == 'circle') {
            this.circleDraw(ctx)
        }
        ctx.restore()
    }

    iterate() {
        iterate(this.rules)
    }

    next() {
        if (this.perc < 1) return
        newRound(this.rules)
        this.rotateType()
    }

    rotateType() {
        this.type = this.rotation.shift()
        this.rotation.push(this.type)
    }
}

function draw(ctx, loader) {
    clear(ctx, loader.container)
    loader.draw(ctx)
    window.requestAnimationFrame(() => {
        loader.iterate()
        loader.next()
        draw(ctx, loader)
    })
}

function loading(ctx, w, h) {
    const loader = new Loaders('dots')
    loader.container = {x: 0, y: 0, w: w, h: h}
    draw(ctx, loader)
}

export {
    loading
}
