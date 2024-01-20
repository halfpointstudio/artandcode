function distanceToZero(a, b, f) {
    return a - ((a-b) * f)
}

function getX(i, p) {
    return p[i*2]
}

function getY(i, p) {
    return p[i*2+1]
}

function formatPoint(p, size) {
    // changing range from 0-99 to 1-100
    p = p + 1

    let s = .5
    // scale to the canvas
    p = p * (size/100*s)
    // center
    p = p + (size/2-(size/2)*s)

    return p
}

function draw(ctx, w, h, nsize, points, rules, t) {
    ctx.clearRect(0, 0, w, h)
    ctx.save()
    ctx.beginPath()
    for (let i=0; i<nsize; i++) {

        let speed = .002

        let obj = {
            x1: formatPoint(
                getX(i, points),
                w
            ),
            x2: getX(i, rules.limits),
            y1: formatPoint(
                getY(i, points),
                h
            ),
            y2: getY(i, rules.limits),
        }

        let x = obj.x1
        let y = obj.y1

        x = distanceToZero(
            x,
            obj.x2,
            (Math.sin(t*Math.PI*speed-(Math.PI/2))+1)/2
        )

        y = distanceToZero(
            y,
            obj.y2,
            (Math.sin(t*Math.PI*speed-(Math.PI/2))+1)/2
        )

        ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
    ctx.clip()
    let nstrips = rules.nstrips
    for (let i=0; i<nstrips; i++) {
        ctx.fillStyle = `hsl(${getX(0, points) + i*getY(0, points)}, 55%, 65%)`
        ctx.fillRect(
            i * (w/nstrips),
            0,
            (i+1)/nstrips * rules.wstrip,
            h
        )
    }
    ctx.restore()

    window.requestAnimationFrame(() => {
        t++
        draw(ctx, w, h, nsize, points, rules, t)
    })
}

function animateWithNumbers(ctx, w, h) {
    let nsize = 4
    let num = Math.floor(Math.random() * (Math.pow(10, nsize*4) - Math.pow(10, nsize*4-1)) + Math.pow(10, nsize*4-1))
    let points = num.toString().match(/.{1,2}/g).map(x => parseInt(x))
    let rules = {
        limits: [0, 0, w, 0, w, h, 0, h],
        nstrips: Math.floor(Math.random() * 100),
        wstrip: Math.floor(Math.random() * 30)
    }
    let t = 0
    draw(ctx, w, h, nsize, points, rules, t)
}

export {
    animateWithNumbers
}
