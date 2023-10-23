import { Challenge } from '../../../store/models/challenge'

export const testCode = `function test(from, to) {
  if (from == to) {
    return
  }

  var a = from.x - to.x
  var b = from.y - to.y

  if (a == b) {
    return true
  }

  if (a > 2) {
    if (b < 2) {
      return true
    } else {
      return false
    }
  }
}`

export const testChallenge = new Challenge('Challenge 0: Test', 2, 300, null, testCode)
