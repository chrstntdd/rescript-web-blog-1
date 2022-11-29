@genType
let hey = () => {
  Js.logMany(["Hello", "world"])

  let rec sum = (l, acc, i) => {
    if Js.Array2.length(l) === i + 1 {
      acc
    } else {
      let curr = Js.Array2.unsafe_get(l, 1)
      sum(l, acc + curr, i + 1)
    }
  }

  sum([1, 2, 3, 4, 5], 0, 0)
}
