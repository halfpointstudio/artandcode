function migrateToObj(fn) {
    Object.defineProperty(fn, 'name', {value: 'prog'})
    const obj = {}    
    obj['prog'] = fn
    obj['meta'] = {}
    return obj
}

function formatDate(time, dst) {
    const srcDate = new Date(time)

    const opts = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }

    if (dst == 'hr:mdy') {
        opts['month'] = 'short'
    }

    if (dst == 'hr:mmdy') {
        opts['month'] = 'long'
    }

    const f = new Intl.DateTimeFormat(undefined, opts)
    .formatToParts(srcDate)
    .reduce((acc, p) => {
        acc[p.type] = p.value
        return acc
    }, {})


    if (dst == 'u') {
        // unix
        return srcDate.getTime()
    }

    if (dst == 'd') {
        // date only
        return `${f.day}-${f.month}-${f.year}`
    }

    if (dst == 't') {
        // time only
        return `${f.hour}:${f.minute}`
    }

    if (dst == 'dt') {
        // date and time 
        return `${f.day}-${f.month}-${f.year}` +
            ` ${f.hour}:${f.minute}`
    }

    if (dst == 'hr:mdy') {
        // human readable month and date
        return `${f.month} ${f.day} ${f.year}`
    }

    if (dst == 'hr:mmdy') {
        // human readable month and date
        return `${f.month} ${f.day} ${f.year}`
    }

    return time
}

class Helper {
    constructor(ctx, w, h) {
        this.ctx = ctx
        this.w = w
        this.h = h
    }

    clear() {
        this._clear()
    }

    _clear() {
        this.ctx.clearRect(0, 0, this.w, this.h)
    }

    _reset() {
        this.ctx.reset()
    }

    _applyBG() {
        this.ctx.fillRect(0, 0, this.w, this.h)
    }

    _guidelines() {
        // Y axis
        this.ctx.beginPath()
        this.ctx.moveTo(this.w/2, 0)
        this.ctx.lineTo(this.w/2, this.h)
        this.ctx.stroke()
        // X axis
        this.ctx.beginPath()
        this.ctx.moveTo(0, this.h/2)
        this.ctx.lineTo(this.w, this.h/2)
        this.ctx.stroke()
    }

    toIsometricProjection(x, y) {
        this.ctx.translate(x, y)
        let ra = -45 * Math.PI/180
        let sa = 15 * Math.PI/180
        this.ctx.transform(
            Math.cos(ra) - Math.sin(ra) * Math.tan(sa),
            Math.sin(ra) + Math.cos(ra) * Math.tan(sa),
            Math.cos(ra) * Math.tan(sa) - Math.sin(ra),
            Math.sin(ra) * Math.tan(sa) + Math.cos(ra),
            0, 0
        )
        this.ctx.translate(-x, -y)
    }

    shear(ax, ay) {
        this.ctx.transform(
            1, Math.tan(ay * Math.PI/180), Math.tan(ax * Math.PI/180),
            1, 0, 0
        )
    }

    shearX(angle) {
        this.shear(angle, 0)
    }

    shearY(angle) {
        this.shear(0, angle)
    }

    rng(a, b) {
        return Math.floor(Math.random() * b + a)
    }

    // TODO: return continues value over an equation
    valuesOverCurve() {
        // example
        // yield sin()
        // yield linear()
        return
    }

    // TODO: continues values 
    speed() {
        // helper.valueOverCurve()
        return
    }

    getHSLA(arr) {
        return `hsl(` + 
            `${arr[0]},`  +
            `${arr[1]}%,` +
            `${arr[2]}%,` +
            `${(arr.length>3)?arr[3]:1}` +
            `)`
    }

    randomHSLA() {
        return this.getHSLA([
            this.rng(0, 360),
            45,
            55,
        ])
    }

    angleToCoords(centerX, centerY, radius, angle) {
        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
        }
    }
}

class Rules {
    constructor(ctx, w, h) {
        this.canvas = {
            ctx: ctx,
            w: w,
            h: h,
        }
        this.track = 0
        this.time = 0
        this.speed = 1
        this.abnormality = {
            x: (Math.random() * -2) + 1,
            y: (Math.random() * -2) + 1,
        }
        this.backup = {
            time: this.time,
            speed: this.speed
        }
    }

    enable(key, value) {
        if (value == null) {
            value = this._calldefaults(key)
        }
        this[key] = value
        this.backup[key] = JSON.parse(JSON.stringify(value))
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

    _check(k) {
        return k in this
    }

    update(key, delta) {

        if (!this._check(key)) {
            error(`${key} key does not exist`)
            return
        }

        if (Array.isArray(this[key])) {
            this[key].forEach((_, i) => {
                this[key][i] += delta[i]
            })
        } else {
            this[key] += delta
        }
    }

    update2D(key, delta) {

        if (!this._check(key)) {
            error(`${key} key does not exist`)
            return
        }

        Object.keys(delta).forEach((k) => {
            this[key][k] += delta[k]
        })
    }

    override(key, value) {
        if (!this._check(key)) {
            error(`${key} key does not exist`)
            return
        }
        this[key] = value
    }

    _reset(key) {
        this[key] = JSON.parse(JSON.stringify(this.backup[key]))
    }

    _next() {
        this.time += 1   
        this.track += 1
    }
}

function error(str) {
    console.error(str)
}

function sortKVPair(md, reverse=false) {
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



export {
    migrateToObj,
    formatDate,
    Rules,
    Helper,
    sortKVPair,
}
