function calcPerc(v, s) {
    return v/100 * s
}

function calcAngle(a, q) {
    return 2*Math.PI*a*q
}

class Loaders {
    constructor(name) {
        this.count = 0
        this.type = name
        this.container = {}
        this.perc = 0
    }

    give_me_center(dims, obj) {
        if (!obj) {
            obj = {
                w: 0,
                h: 0
            }
        }
        return {
            x: dims.w / 2 - (obj.w / 2) + dims.x,
            y: dims.h / 2 - (obj.h / 2) + dims.y
        }
    }

    set styles(arr) {
        this.rotation = arr
        this.rotation = this.rotation.filter((x) => x != this.type)
        this.rotation.push(this.type)
    }

    set rulesOf(name) {
        if (name == 'default') {
            this.rules = this.defaultRules()
        }
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
        const coords = this.give_me_center(this.container, rect)
        this.perc = calcPerc(this.rules.t, this.rules.speed)
        ctx.save()
        ctx.fillStyle = `hsl(${c.h}, ${c.s}%, ${c.l}%, ${c.a * this.perc})`
        ctx.fillRect(
            coords.x,
            coords.y,
            rect.w * this.perc,
            rect.h
        )
        ctx.restore()
    }

    dotsDraw(ctx) {
        const rect = this.rules.rect
        const c = this.rules.color
        const coords = this.give_me_center(this.container, rect)
        this.perc = calcPerc(this.rules.t, this.rules.speed)
        for (let ix=0;ix<10*this.perc;ix++) {
            ctx.save()
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
            ctx.restore()
        }
    }

    circleDraw(ctx) {
        const rect = this.rules.rect
        const c = this.rules.color
        const coords = this.give_me_center(this.container, null)
        this.perc = calcPerc(this.rules.t, this.rules.speed)
        ctx.save()
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
        ctx.restore()
    }

    lineBounceDraw(ctx) {
        const rect = this.rules.rect
        const c = this.rules.color
        const coords = this.give_me_center(this.container, null)
        this.perc = calcPerc(this.rules.t, this.rules.speed)
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = `hsl(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`
        ctx.moveTo(coords.x - rect.w*.5, (coords.y + Math.sin(this.perc*20+Math.PI*.5)*20)+rect.h)
        ctx.lineTo(coords.x + rect.w*.5, (coords.y + Math.sin(this.perc*20+Math.PI*.5)*20)+rect.h)
        ctx.stroke()
        ctx.restore()
        ctx.save()
        ctx.fillStyle = `hsl(${c.h}, ${c.s}%, ${c.l}%, ${c.a * this.perc})`
        ctx.beginPath()
        ctx.arc(
            (coords.x - rect.w*.5) + (rect.w * this.perc),
            coords.y + Math.sin(this.perc*20+Math.PI*.5)*20,
            rect.h*.5,
            0,
            calcAngle(1, 1)
        )
        ctx.fill()
        ctx.restore()
    }

    draw(ctx) {
        ctx.save()
        if (this.type == 'default') {
            this.defaultDraw(ctx)
        } else if (this.type == 'dots') {
            this.dotsDraw(ctx)
        } else if (this.type == 'circle') {
            this.circleDraw(ctx)
        } else if (this.type == 'linebounce') {
            this.lineBounceDraw(ctx)
        }
        ctx.restore()
    }

    iterate() {
        this.rules.t += 1
    }

    next(isRotate) {
        if (this.perc < 1) return
        this.count += 1
        this.rules.t = 0
        this.rules.color.h = Math.random() * 360
        if (isRotate) {
            this.rotateType()
        }
    }

    rotateType() {
        this.type = this.rotation.shift()
        this.rotation.push(this.type)
    }

    clear(ctx) {
        ctx.save()
        const area = this.container
        ctx.clearRect(area.x, area.y, area.w, area.h)
        ctx.restore()
        this.fillbg(ctx)
    }

    fillbg(ctx) {
        ctx.save()
        const area = this.container
        ctx.fillStyle = 'black'
        ctx.fillRect(area.x, area.y, area.w, area.h)
        ctx.restore()
    }
}

function draw(ctx, loader) {
    loader.clear(ctx)
    loader.draw(ctx)
    window.requestAnimationFrame(() => {
        loader.iterate()
        loader.next(false)
        draw(ctx, loader)
    })
}

function loading(ctx, w, h) {
    const styles = ['default', 'dots', 'circle', 'linebounce']
    const ncontainer = { w: 2, h: 2 }
    for (let ix=0; ix<ncontainer.w; ix++){
        for (let iy=0; iy<ncontainer.h; iy++) {
            const x = styles[ix*ncontainer.w+iy]
            const loader = new Loaders(x)
            loader.quad = ix*ncontainer.w+iy
            loader.styles = styles
            loader.rulesOf = 'default'
            const containerW = w/ncontainer.w
            const containerH = h/ncontainer.h
            loader.container = { x: containerW * (ix % ncontainer.w), y: containerH * (iy % ncontainer.h), w: containerW, h: containerH }
            draw(ctx, loader)
        }
    }
}

export {
    loading
}
