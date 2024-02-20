function migrateToObj(fn) {
    Object.defineProperty(fn, 'name', {value: 'prog'})
    const obj = {}    
    obj['prog'] = fn
    obj['meta'] = {}
    return obj
}

function formatDate(time, dst) {
    const srcDate = new Date(time)

    const opts = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }

    if (dst == 'hr:mdy') {
        opts['month'] = 'short'
    }

    if (dst == 'hr:mmdy') {
        opts['month'] = 'long'
    }

    const f = new Intl.DateTimeFormat(undefined, opts)
    .formatToParts(srcDate)
    .reduce((acc, p) => {
        acc[p.type] = p.value
        return acc
    }, {})


    if (dst == 'u') {
        // unix
        return srcDate.getTime()
    }

    if (dst == 'd') {
        // date only
        return `${f.day}-${f.month}-${f.year}`
    }

    if (dst == 't') {
        // time only
        return `${f.hour}:${f.minute}`
    }

    if (dst == 'dt') {
        // date and time 
        return `${f.day}-${f.month}-${f.year}` +
            ` ${f.hour}:${f.minute}`
    }

    if (dst == 'hr:mdy') {
        // human readable month and date
        return `${f.month} ${f.day} ${f.year}`
    }

    if (dst == 'hr:mmdy') {
        // human readable month and date
        return `${f.month} ${f.day} ${f.year}`
    }

    return time
}

export {
    migrateToObj,
    formatDate
}
