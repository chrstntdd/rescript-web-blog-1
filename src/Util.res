@scope("crypto")
external getRandomValuesU8: Js.TypedArray2.Uint8Array.t => Js.TypedArray2.Uint8Array.t =
  "getRandomValues"

let remainder_float = (a: float, b: float): float => {
  let _ = a
  let _ = b
  %raw(`a % b`)
}

@dead
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

exception DivisionByZero({hey: string})

let remainder_float_exn = (~dividend, ~divisor) => {
  if divisor == 0. {
    raise(DivisionByZero({hey: "👋"}))
  } else {
    remainder_float(dividend, divisor)
  }
}

let accumulate_uint8_entries = ta => {
  let last_index = Js.TypedArray2.Uint8Array.length(ta) - 1
  let get_from_index = Js.TypedArray2.Uint8Array.unsafe_get(ta)

  let rec loop = (acc, i) => {
    if i == last_index {
      acc
    } else {
      let curr = i->get_from_index->Belt.Int.toFloat
      let acc = acc +. curr *. 256. ** Belt.Int.toFloat(i)

      loop(acc, i + 1)
    }
  }

  loop(0., 0)
}

@genType
let random_int_rec = (. ~min, ~max) => {
  let range = max -. min +. 1.
  let dividend = {
    let bytes_needed = Js.Math.ceil_int(Js.Math.log2(range) /. 8.)
    let cutoff = Js.Math.floor_float(256. ** Belt.Int.toFloat(bytes_needed) /. range) *. range
    let bytes = Js.TypedArray2.Uint8Array.fromLength(bytes_needed)
    let rec loop = (. ()) => {
      let value = bytes->getRandomValuesU8->accumulate_uint8_entries

      if value >= cutoff {
        loop(.)
      } else {
        value
      }
    }

    loop(.)
  }

  min +. remainder_float_exn(~dividend, ~divisor=range)
}

@scope("crypto")
external getRandomValuesU32: Js.TypedArray2.Uint32Array.t => Js.TypedArray2.Uint32Array.t =
  "getRandomValues"

@genType
let random_int_no_loop = (. ~min, ~max) => {
  let range = Js.Math.abs_float(max -. min) +. 1.
  let dividend =
    Js.TypedArray2.Uint32Array.fromLength(1)
    ->getRandomValuesU32
    ->Js.TypedArray2.Uint32Array.unsafe_get(0)
    ->Belt.Float.fromInt

  min +. remainder_float_exn(~dividend, ~divisor=range)
}
