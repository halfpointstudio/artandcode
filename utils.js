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
        this.ctx.clearRect(0, 0, this.w, this.h)
    }

    rng(a, b) {
        return Math.floor(Math.random() * b + a)
    }
}

class Rules {
    constructor(ctx, w, h) {
        this.canvas = {
            ctx: ctx,
            w: w,
            h: h,
        }
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

    update(key, delta) {
        this[key] += delta
    }

    update2D(key, delta) {
        Object.keys(delta).forEach((k) => {
            this[key][k] += delta[k]
        })
    }

    override(key, value) {
        if (!(key in this)) return
        this[key] = value
    }

    _reset(key) {
        this[key] = JSON.parse(JSON.stringify(this.backup[key]))
    }

    _next() {
        this.time += 1   
    }
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
