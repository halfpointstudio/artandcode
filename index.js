const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
document.getElementById('canvas').appendChild(canvas)

function resize() {
    const parent = document.querySelector('section#canvas')
    console.log(parent.offsetWidth, parent.offsetHeight)
    const size = Math.min(parent.offsetWidth, parent.offsetHeight) * .9
    canvas.style.width = size
    canvas.style.height = size

    canvas.width = Math.ceil(size / 1000) * 1000
    canvas.height = Math.ceil(size / 1000) * 1000

    window.requestAnimationFrame(() => 
        draw(ctx, canvas.width, canvas.height)
    )
}

window.addEventListener('resize', resize, true)
resize()

function draw(ctx, w, h) {
    ctx.save()

    squares_5(ctx, w, h)

    ctx.restore()
}

// 100 shapes exercise
function squares_5(ctx, w, h) {

    // top left
    ctx.save()
    ctx.fillStyle = 'hsl(150, 55%, 55%, .6)'
    ctx.fillRect(0, 0, w*.25, h*.25)
    ctx.restore()

    // top right
    ctx.save()
    ctx.fillStyle = 'hsl(20, 45%, 70%, 1)'
    ctx.fillRect(w*.75, 0, w*.25, h*.25)
    ctx.restore()

    // bottom left
    ctx.save()
    ctx.fillStyle = 'hsl(200, 55%, 55%, .6)'
    ctx.fillRect(0, h*.75, w*.25, h*.25)
    ctx.restore()

    // bottom right
    ctx.save()
    ctx.fillStyle = 'hsl(240, 55%, 55%, .6)'
    ctx.fillRect(w*.75, h*.75, w*.25, h*.25)
    ctx.restore()

    // center
    ctx.save()
    ctx.fillStyle = 'hsl(360, 55%, 43%, .6)'
    ctx.fillRect(w*.25, h*.25, w/2, h/2)
    ctx.restore()
    
}


