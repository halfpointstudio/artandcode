import { Helper, Rules } from "../utils"

function draw(rules, helper) {
    const [ctx, w, h] = Object.values(rules.canvas)
    helper._clear()

    // ctx.save()
    // helper._applyBG()
    // ctx.restore()

    ctx.save()
    ctx.strokeStyle = 'green'

    // helper._guidelines()

    // ctx.save()
    // let angle1 = rules.time
    // let angle2 = rules.time
    // let cs = Math.cos(angle1)
    // let sn = Math.sin(angle1)
    // let hi = Math.cos(angle2)
    // let a = 100 * cs, c = -100 * sn, e = 200
    // let b = hi * 100 * sn, d = hi * 100 * cs, f = 200
    // // ctx.setTransform(a, d, b, e, c, f)
    // ctx.setTransform(a, b, c, d, e, f)

    // ctx.setTransform(0, 1, -1, 0, 1000, 0)

    // ctx.setTransform(
    //     1/Math.sqrt(4), 1/Math.sqrt(6), .2,
    //     2/Math.sqrt(6), 0, 0
    // )


    // ctx.translate(w/2, h/2)
    // ctx.rotate(0 * Math.PI/180)
    // ctx.translate(-w/2, -h/2)

    ctx.save()
    let size, x, y

    size = 100
    x = (w - size)/2
    y = (h - size)/2

    helper.toIsometricProjection(w/2, h/2)

    for (let iy=-10;iy<10;iy++) {
        ctx.fillStyle = `hsl(100, 45%, 55%, .1)`
        ctx.fillRect(x - iy * 5, y + iy * 5, size, size)
    }

    ctx.restore()


    window.requestAnimationFrame(() => {
        rules._next()
        draw(rules, helper)
    })

}

function stacked(ctx, w, h) {
    const rules = new Rules(ctx, w, h)
    const helper = new Helper(ctx, w, h)

    draw(rules, helper)
}

export {
    stacked
}
