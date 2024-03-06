import { Helper, Rules } from "../utils"

function draw(rules, helper) {

    const [ctx, w, h] = Object.values(rules.canvas)
    helper._clear()
    
    ctx.save()
    ctx.lineWidth = 3
    ctx.strokeStyle = helper.getHSLA(rules.orange)
    ctx.fillStyle = helper.getHSLA(rules.yellow)
    ctx.beginPath()
    ctx.arc(
        rules['shape.pos'].x,
        rules['shape.pos'].y,
        rules['shape.radius'],
        0, 2 * Math.PI
    )
    ctx.fill()
    ctx.stroke()
    ctx.restore()


    ctx.save()
    let pos
    const lines = rules['shape.lines']
    ctx.lineWidth = 3
    ctx.strokeStyle = helper.getHSLA(rules.orange)
    for (let i=0; i<lines; i++) {
        const angle = i * (360/lines)
        const sr = 20
        const er = (
            i + (Math.round(rules.time * rules.speed) % 2)
        ) % 2 == 0? 50: 100
        ctx.beginPath()
        pos = helper.angleToCoords(
            rules['shape.pos'].x,
            rules['shape.pos'].y,
            rules['shape.radius'] + sr,
            angle * Math.PI/180
        )
        ctx.moveTo(pos.x, pos.y)
        pos = helper.angleToCoords(
            rules['shape.pos'].x,
            rules['shape.pos'].y,
            rules['shape.radius'] + er,
            angle * Math.PI/180
        )
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
    }
    ctx.restore()


    window.requestAnimationFrame(() => {
        rules._next()
        draw(rules, helper)
    })
}


function sun(ctx, w, h) {
    const rules = new Rules(ctx, w, h)
    const helper = new Helper(ctx, w, h)

    rules.enable('speed', .01)
    rules.enable('shape.lines', 16)
    rules.enable('orange', [35, 100, 46])
    rules.enable('yellow', [55, 80, 65])
    rules.enable('shape.pos', {
        x: w/2,
        y: h/2
    })
    rules.enable('shape.radius', w/5)

    draw(rules, helper)
}

export {
    sun
}
