module.exports.randomInteger = function (min, max) {
  return Math.round(
    min - 0.5 + Math.random() * (max - min + 1)
  )
}
