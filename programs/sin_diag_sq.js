const sleep = ms => new Promise(r => setTimeout(r, ms))
const fract = n => n - Math.floor(n)
const betterFract = n => Math.max(fract(n+.5), fract(1-n+.5)) * 2 - 1
async function sin_diag_sq(ctx, w, h) {
    ctx.save()
    for (let t=0; t<10; t+=.001) {
        ctx.clearRect(0, 0, w, h)
        for(let ix=0; ix<w/10; ix++) {
            ctx.fillStyle = `hsl(${ix * (360 / w * 10)}, 50%, 50%, 1)`
            ctx.fillRect(
                ix * 10,
                (Math.cos(ix / (w/10 / 1) * Math.PI * 2 + (Math.PI - t)) + 1) / 2 * w,
                10,
                10
            )
            ctx.fillRect(ix * 10, ix * 10, 10, 10)
        }
        await sleep(10)
    }
    ctx.restore()
}

export {
    sin_diag_sq
}
