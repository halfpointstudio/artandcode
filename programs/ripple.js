function calcRadius(time, rules, i) {
    return Math.sin((time * rules.speed % 10)/10 * (Math.PI/1))
            * (rules.max*i*0.01)
    
}
function calcAngle(a, q) {
    return 2*Math.PI*a*q
}

function draw(ctx, w, h, rules, t) {
    ctx.clearRect(0, 0, w, h)
    let r = 0
    if (rules.phase == 'grow') {
        ctx.save()
        for (let i=0; i<rules.arc.length; i++) {
            ctx.strokeStyle = `hsl(${rules.color}, ${i}%, ${i}%)`
            ctx.beginPath()
            ctx.lineWidth = i * 0.05
            r = calcRadius(t, rules, i+1)
            ctx.arc(w/2, h/2, r, calcAngle(1, rules.push),  calcAngle(rules.arc[i], rules.quart)+calcAngle(1, rules.push))
            ctx.stroke()
        }
        ctx.restore()
    }
    if (rules.phase == 'rotate') {
        ctx.save()
        ctx.translate(w/2, h/2)
        ctx.rotate((((t - rules.saveT) % 360) * Math.PI)/ 180)
        ctx.translate(-w/2, -h/2)
        for (let i=0; i<rules.arc.length; i++) {
            ctx.strokeStyle = `hsl(${rules.color}, ${i}%, ${i}%)`
            ctx.beginPath()
            ctx.lineWidth = i * 0.05
            r = calcRadius(rules.saveT, rules, i+1)
            ctx.arc(w/2, h/2, r, calcAngle(1, rules.push),  calcAngle(rules.arc[i], rules.quart)+calcAngle(1, rules.push))
            ctx.stroke()
        }
        ctx.restore()
    }

    if (Math.ceil(r) == rules.max & rules.phase != 'rotate') {
        rules.phase = 'rotate'
        rules.saveT = t
    } else if (rules.phase == 'rotate' & (t - rules.saveT) == 360) {
        rules.phase = 'grow'
        t = rules.saveT+21
        r = calcRadius(t, rules, 100)
    } else if (r == 0 & t != 0) {
        rules.color = Math.floor(Math.random() * 360)
        rules.quart = (Math.floor(Math.random()*8)+1)/8
        rules.push = (Math.floor(Math.random()*4))/4
        console.log(rules)
    }

    window.requestAnimationFrame(() => {
        t++
        draw(ctx, w, h, rules, t)
    })
}

function ripple(ctx, w, h) {
    const rules = {
        quart: (Math.floor(Math.random()*8)+1)/8,
        push: (Math.floor(Math.random()*4))/4,
        arc: new Array(100).fill(0).map(x => Math.random() ),
        speed: 0.05,
        max: w/2,
        phase: 'grow',
        saveT: 0,
        rMax: 360,
        color: Math.floor(Math.random() * 360)
    }
    let t = 0
    console.log(rules )
    draw(ctx, w, h, rules, t)
}

export {
    ripple
}
