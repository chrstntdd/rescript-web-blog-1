@scope("crypto")
external getRandomValuesU8: Js.TypedArray2.Uint8Array.t => Js.TypedArray2.Uint8Array.t =
  "getRandomValues"

let remainder_float = (a: float, b: float): float => {
  let _ = a
  let _ = b
  %raw(`a % b`)
}

let random_int_reduce = (min, max) => {
  open Js.Math
  let toFloat = Belt.Int.toFloat
  let range = max -. min +. 1.
  let bytes_needed = ceil_int(log2(range) /. 8.)
  let cutoff = floor_float(256. ** toFloat(bytes_needed) /. range) *. range
  let bytes = Js.TypedArray2.Uint8Array.fromLength(bytes_needed)

  let rec loop = _ => {
    let value =
      bytes
      ->getRandomValuesU8
      ->Js.TypedArray2.Uint8Array.reducei(
        (. acc, curr, i) => acc +. toFloat(curr) *. 256. ** toFloat(i),
        0.,
      )

    if value >= cutoff {
      loop()
    } else {
      value
    }
  }

  let value = loop()
  min +. remainder_float(value, range)
}
