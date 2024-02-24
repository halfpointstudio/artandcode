import { Helper, Rules } from "../utils"

function draw(rules, helper) {
    const ctx = rules.canvas.ctx
    const w = rules.canvas.w
    const h = rules.canvas.h

    helper._clear()
    ctx.save()
    ctx.fillStyle = helper.getHSLA(rules.colors[1])
    helper._applyBG()
    ctx.restore()

    const size = w/rules.ngrid
    for (let iy=0; iy<rules.ngrid; iy++) {

        if ( iy > 0 & rules.isGrid) {
            // X - Axis
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(iy*size, 0)
            ctx.lineTo(iy*size, h)
            ctx.stroke()
            ctx.restore()

            // Y - Axis
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(0, iy*size)
            ctx.lineTo(w, iy*size)
            ctx.stroke()
            ctx.restore()
        }

        for (let ix=0; ix<rules.ngrid; ix++) {
            ctx.fillStyle = helper.getHSLA(rules.colors[0])
            let textColor = helper.getHSLA([...rules.colors[2], .5])

            let letter = String.fromCharCode(Math.random() * 25 + 65)
            Object.entries(rules.words).forEach(([w, d]) => {
                if (d.xdir) {
                    if ( iy*rules.ngrid + ix >= d.pos & iy*rules.ngrid + ix < d.pos + w.length) {
                        const ind = (iy*rules.ngrid+ix) - (d.pos)
                        letter = w[ind].toUpperCase()
                        if (d.isHighlighted ) {
                            textColor = helper.getHSLA([...rules.colors[2].slice(0, 2), 10, 1])
                            ctx.fillRect(ix*size, iy*size, size, size)
                        } else {
                            textColor = helper.getHSLA([...rules.colors[2], 1])
                        }
                    }
                } else {
                    if ( ix*rules.ngrid + iy >= d.pos & ix*rules.ngrid + iy < d.pos + w.length) {
                        const ind = (ix*rules.ngrid+iy) - (d.pos)
                        letter = w[ind].toUpperCase()
                        if (d.isHighlighted) {
                            textColor = helper.getHSLA([...rules.colors[2].slice(0, 2), 10, 1])
                            ctx.fillRect(ix*size, iy*size, size, size)
                        } else {
                            textColor = helper.getHSLA([...rules.colors[2], 1])
                        }
                    }
                }
            })

            ctx.save()
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = textColor
            ctx.font = `${rules.fontsize}px serif`
            ctx.fillText(
                letter,
                ix*size + size/2,
                iy*size + size/2
            )
            ctx.restore()
        }
    }
    window.requestAnimationFrame(() => {
        rules._next()
    })
}

function letters_grid(ctx, w, h) {
    const rules = new Rules(ctx, w, h)
    const helper = new Helper(ctx, w, h)
    rules.enable('hue', 200)
    rules.enable('ngrid', 50)
    rules.enable('fontsize', 12)
    rules.enable('colors', [
        [37, 100, 64, 1],
        [178, 67, 38, 1],
        [231, 53, 17],
        // 'hsl(37, 100%, 64%, 1)',
        // 'hsl(178, 67%, 38%, 1)',
        // 'hsl(231, 53%, 17%, 1)'
    ])
    rules.enable('colors', [
        [37, 100, 64, 1],
        [163, 82, 11, 1],
        [245, 44, 90],
        // hsl(37, 100%, 64%)
        // hsl(163, 82%, 11%)
        // hsl(245, 44%, 90%)
    ])
    rules.enable('isGrid', false)

    rules.enable('colors', [
        [37, 100, 64, 1],
        [163, 82, 11, 1],
        [179, 90, 85],
        // hsl(37, 100%, 64%)
        // hsl(163, 82%, 11%)
        // hsl(179, 44%, 55%)
    ])

    // const words = {
    //     'unitedstates': 0,
    //     'donaldtrump': 0,
    //     'elizabeth2': 0,
    //     'india': 0,
    //     'barackobama': 0,
    //     'cristinaoronaldo': 0,
    //     'worldwar2': 0,
    //     'unitedkingdom': 0,
    //     'michaeljackson': 0,
    //     'elonmusk': 0,
    // }

    const words = {
        'jaded': 1,
        'confused': 0,
        'somewhere': 0,
    }

    // const words = {
    //     'brightmoments': 1,
    //     'france': 1, 
    //     'paris': 1, 
    //     '2024': 1,
    //     'martingrasser': 0,
    //     'andreas': 0,
    //     'aranda': 0,
    //     'camilleroux': 0,
    //     'matthieu': 0,
    //     'florian': 0,
    //     'vanden': 0,
    //     'jeff': 0,
    //     'luke': 0,
    //     'maya': 0,
    //     'rudxane': 0,
    //     'sarah': 0,
    // }
    const wordsWithData = Object.entries(words).reduce((acc, [w, h]) => {
        acc[w] = {
            pos: Math.floor(Math.random() * (rules.ngrid * rules.ngrid)),
            xdir: Math.round(Math.random()),
            isHighlighted: h,
        }
        return acc
    }, {})
    rules.enable('words', wordsWithData)
    window.data = JSON.stringify(rules.words)


    // let loadedData = '{"andreas":{"pos":883,"xdir":0,"isHighlighted":1},"brightmoments":{"pos":505,"xdir":1,"isHighlighted":1},"2024":{"pos":1887,"xdir":1,"isHighlighted":1},"france":{"pos":1420,"xdir":1,"isHighlighted":1},"martingrasser":{"pos":353,"xdir":1,"isHighlighted":1},"vanden":{"pos":889,"xdir":1,"isHighlighted":1},"aranda":{"pos":178,"xdir":1,"isHighlighted":1},"camilleroux":{"pos":1183,"xdir":1,"isHighlighted":1},"matthieu":{"pos":675,"xdir":1,"isHighlighted":1},"florian":{"pos":1351,"xdir":1,"isHighlighted":1},"paris":{"pos":1830,"xdir":0,"isHighlighted":1},"jeff":{"pos":962,"xdir":0,"isHighlighted":1},"luke":{"pos":188,"xdir":1,"isHighlighted":1},"maya":{"pos":365,"xdir":0,"isHighlighted":1},"rudxane":{"pos":1018,"xdir":1,"isHighlighted":1},"sarah":{"pos":1755,"xdir":1,"isHighlighted":1}}'
    // let loadedData = '{"unitedstates":{"pos":2167,"xdir":0,"isHighlighted":0},"donaldtrump":{"pos":859,"xdir":0,"isHighlighted":0},"elizabeth2":{"pos":486,"xdir":1,"isHighlighted":0},"india":{"pos":1054,"xdir":1,"isHighlighted":0},"barackobama":{"pos":2414,"xdir":0,"isHighlighted":0},"cristinaoronaldo":{"pos":1400,"xdir":0,"isHighlighted":0},"worldwar2":{"pos":1276,"xdir":0,"isHighlighted":0},"unitedkingdom":{"pos":2033,"xdir":1,"isHighlighted":0},"michaeljackson":{"pos":631,"xdir":0,"isHighlighted":0},"elonmusk":{"pos":356,"xdir":1,"isHighlighted":0}}'
    // loadedData = JSON.parse(loadedData)
    // Object.entries(loadedData).forEach(([k, v]) => {
    //     v.isHighlighted = words[k]
    // })
    // rules.override('words', loadedData)
    // console.info(JSON.stringify(rules.words))

    draw(rules, helper)
}

export {
    letters_grid
}
