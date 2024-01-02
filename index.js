const canvas = document.createElement('canvas')
canvas.width = 1000;
canvas.height = 1000;
canvas.style.width = '500px';
canvas.style.height = '500px';
const ctx = canvas.getContext('2d')

document.getElementById('canvas').appendChild(canvas)

drawSq(ctx, canvas.width, canvas.height)

function drawSq(ctx, w, h) {
    ctx.save()
    ctx.fillRect(0, 0, w, h)
    ctx.restore()
}

