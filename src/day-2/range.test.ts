import { describe, expect, it } from "@effect/vitest"
import { Schema } from "effect"
import { Range } from "./range"

describe("Day 2: Range", () => {
  const makeCase = (props: {
    input: string
    pt1Sum: number
    pt2Sum: number
  }) => {
    const rotation = Schema.decodeUnknownSync(Range.fromString)(props.input)
    return [
      props.input,
      () => {
        expect(rotation.calculateIdSum().part1Sum).toBe(props.pt1Sum)
        expect(rotation.calculateIdSum().part2Sum).toBe(props.pt2Sum)
      },
    ] as const
  }

  it(
    ...makeCase({
      input: "11-22",
      pt1Sum: 33,
      pt2Sum: 33,
    }),
  )
  it(
    ...makeCase({
      input: "95-115",
      pt1Sum: 99,
      pt2Sum: 210,
    }),
  )
  it(
    ...makeCase({
      input: "998-1012",
      pt1Sum: 1010,
      pt2Sum: 2009,
    }),
  )
  it(
    ...makeCase({
      input: "1188511880-1188511890",
      pt1Sum: 1188511885,
      pt2Sum: 1188511885,
    }),
  )
  it(
    ...makeCase({
      input: "222220-222224",
      pt1Sum: 222222,
      pt2Sum: 222222,
    }),
  )
  it(
    ...makeCase({
      input: "1698522-1698528",
      pt1Sum: 0,
      pt2Sum: 0,
    }),
  )
  it(
    ...makeCase({
      input: "446443-446449",
      pt1Sum: 446446,
      pt2Sum: 446446,
    }),
  )
  it(
    ...makeCase({
      input: "38593856-38593862",
      pt1Sum: 38593859,
      pt2Sum: 38593859,
    }),
  )
  it(
    ...makeCase({
      input: "824824821-824824827",
      pt1Sum: 0,
      pt2Sum: 824824824,
    }),
  )
  it(
    ...makeCase({
      input: "2121212118-2121212124",
      pt1Sum: 0,
      pt2Sum: 2121212121,
    }),
  )
})
