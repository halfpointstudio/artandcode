function gradient_hsb(ctx, w, h) {
    ctx.save()
    for(let ix=0; ix<=w/10; ix++) {
        for (let iy=0; iy<=h/10; iy++) {
            ctx.fillStyle = `hsl(${ix*10}, ${100 - (iy * 1)}%, ${100 - (ix * 1)}%, 1)`
            ctx.fillRect(ix * 10, iy * 10, 10, 10)
        }
    }
    ctx.restore()
}

export {
    gradient_hsb
}
