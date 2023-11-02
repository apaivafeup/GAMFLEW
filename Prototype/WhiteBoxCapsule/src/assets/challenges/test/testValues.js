import { TestChallenge } from './testChallenge'

export const testCode = `function test(from, to) {
  var a = Math.abs(from.x - to.x)
  var b = Math.abs(from.y - to.y)

  if (a > 2) {
    if (b < 2) {
      return true
    } else {
      return false
    }
  }
}`

export const f = function test(from, to) {
  var a = Math.abs(from.x - to.x)
  var b = Math.abs(from.y - to.y)

  if (a > 2) {
    if (b < 2) {
      return true
    } else {
      return false
    }
  }
}

export const testChallenge = new TestChallenge('Challenge 0: Test', 2, 300, null, testCode, f)
