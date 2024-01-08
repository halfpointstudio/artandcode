function draw(ctx, sq, rules, w, h) {
    const moveBy = 5
    const color = sq.color
    ctx.clearRect(0, 0, w, h)
    
    ctx.save()
    ctx.scale(.5, .5)
    ctx.fillStyle = `hsl(${color.h}, ${color.s}%, ${color.l}%, 1)`
    ctx.fillRect(
        sq.x,
        sq.y,
        sq.w,
        sq.h
    )
    ctx.restore()

    ctx.save()
    ctx.scale(.5, .5)
    ctx.rotate((90 * Math.PI) / 180)
    ctx.translate(0, -h*2)
    ctx.fillStyle = `hsl(${color.h + 45}, ${color.s}%, ${color.l}%, 1)`
    ctx.fillRect(
        sq.x,
        sq.y,
        sq.w,
        sq.h
    )
    ctx.restore()

    ctx.save()
    ctx.scale(-.5, -.5)
    ctx.translate(-w*2, -h*2)
    ctx.fillStyle = `hsl(${color.h + 180}, ${color.s}%, ${color.l}%, 1)`
    ctx.fillRect(
        sq.x,
        sq.y,
        sq.w,
        sq.h
    )
    ctx.restore()

    ctx.save()
    ctx.scale(.5, .5)
    ctx.rotate((270 * Math.PI) / 180)
    ctx.translate(-w*2, 0)
    ctx.fillStyle = `hsl(${color.h + 45 + 180}, ${color.s}%, ${color.l}%, 1)`
    ctx.fillRect(
        sq.x,
        sq.y,
        sq.w,
        sq.h
    )
    ctx.restore()

    if (sq.w < rules.maxw & sq.h == rules.minh) sq.w += moveBy
    if (sq.w == rules.maxw & sq.h < rules.maxh) sq.h += moveBy
    if (sq.w > rules.minw & sq.h == rules.maxh) sq.w -= moveBy
    if (sq.w == rules.minw & sq.h > rules.minw) sq.h -= moveBy
    window.requestAnimationFrame(() => draw(ctx, sq, rules, w, h))
}

function four_sq(ctx, w, h) {
    const sq = {w: 50, h: 50, x: 0, y: 0, gap: 5, color: {h: 333, s:50, l:60}}
    const rules = { minw: sq.w, minh: sq.h, maxw: w, maxh: h}
    draw(ctx, sq, rules, w, h)
}


export {
    four_sq
}

