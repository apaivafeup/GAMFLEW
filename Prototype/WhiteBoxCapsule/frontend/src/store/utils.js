export function combinations(array, k) {
    if (array == null) {
        return
    }

    var i,
        subI,
        ret = [],
        sub,
        next

    for (i = 0; i < array.length; i++) {
        if (k === 1) {
            ret.push([array[i]])
        } else {
            sub = combinations(array, k - 1)
            for (subI = 0; subI < sub.length; subI++) {
                next = sub[subI]
                next.unshift(array[i])
                ret.push(next)
            }
        }
    }

    return ret
}