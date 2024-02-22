import { Helper, Rules } from "../utils"

function draw(rules, helper) {
    // helper.clear()
    const [ctx, w, h] = Object.values(rules.canvas)
    ctx.clearRect(0, 0, w, h)

    ctx.save()
    ctx.beginPath()
    // top layer bg
    // ctx.fillStyle = `hsl(240, 0%, 100%, 1)`
    ctx.fillStyle = `hsl(28, 67%, 44%, 1)`
    ctx.fillRect(0, 0, w, h)
    ctx.font = `${rules.fontsize}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // top layer text
    // ctx.fillStyle = `hsl(240, 74%, 6%, 1)`
    ctx.fillStyle = `hsl(32, 65%, 62%, 1)`
    ctx.fillText(rules.text, rules.coords.x, rules.coords.y)
    ctx.restore()

    let bounds = {}
    ctx.save()
    ctx.beginPath()
    let width_sum = w
    for (let i=0;i<rules.clip.n;i++) {
        const eq1 = ((Math.sin( ((i)+Math.PI*Math.PI + rules.delta/20) * Math.PI / (rules.clip.n + 1)) + 1)/2 * .8)+.2
        const eq2 = ((Math.sin( ((rules.clip.n - i)+Math.PI*Math.PI + rules.delta/20) * Math.PI / (rules.clip.n + 1)) + 1)/2 * 2)+0.1
        bounds = {
            y: rules.clip.y + h/2 - (rules.clip.h/2),
            w: rules.clip.w * eq2,
            h: rules.clip.h
        }

        const min_gap = 5
        width_sum -= bounds.w
        let movement = Math.sin(rules.delta/100) * 350
        bounds.x = (rules.clip.x + movement) + width_sum
        width_sum -= min_gap

        ctx.fillStyle = 'red'
        ctx.rect(
            bounds.x, bounds.y, bounds.w, bounds.h
        )
        ctx.fill()
    }
    ctx.closePath()
    ctx.restore()

    ctx.save()
    ctx.clip()
    ctx.beginPath()
    // back layer bg
    // ctx.fillStyle = `hsl(240, 74%, 6%, 1)`
    ctx.fillStyle = `hsl(88, 38%, 15%, 1)`
    ctx.fillRect(0, 0, w, h)
    ctx.font = `${rules.fontsize}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // back layer text
    // ctx.fillStyle = `hsl(240, 0%, 65%, 1)`
    // ctx.fillStyle = `hsl(74, 32%, 32%, 1)`
    ctx.fillStyle = `hsl(52, 94%, 94%, 1)`
    ctx.fillText(rules.text, rules.coords.x, rules.coords.y)
    ctx.restore()

    window.requestAnimationFrame(() => {
        rules.update('delta', rules.speed)
        draw(rules, helper)
    })

}

function text_framing(ctx, w, h) {
    const rules = new Rules(ctx, w, h)
    const helper = new Helper(ctx, w, h)

    rules.enable('coords', {
        x: w/2,
        y: h/2
    })
    rules.enable('fontsize', 200)
    // TODO: multiple text
    // rules.enable('text', ['everything', 'everywhere', 'all at', 'once'])
    // rules.enable('text', 'everything')
    rules.enable('text', 'gucci')
    rules.enable('clip', {
        n: 25,
        x: -w/3.5,
        y: 0,
        w: w * .01,
        h: h * 1
    })
    rules.enable('isClipTouchRightBorder', false)
    rules.enable('delta', 0)

    draw(rules, helper)
}

export {
    text_framing
}
