import { describe, expect, it } from "@effect/vitest"
import { Direction, Rotation } from "."

describe("Day 1: Rotation", () => {
  let position = 50

  const makeCase = (props: {
    amount: number
    direction: Direction
    expectedZeros: number
    expectedPosition: number
  }) => {
    const rotation = Rotation.make({
      amount: props.amount,
      direction: props.direction,
    })
    return [
      rotation.toString(),
      () => {
        const result = rotation.apply(position)

        expect(result.newPosition).toBe(props.expectedPosition)
        expect(result.zeroHits).toBe(props.expectedZeros)

        position = result.newPosition
      },
    ] as const
  }

  it(
    ...makeCase({
      direction: "L",
      amount: 68,
      expectedPosition: 82,
      expectedZeros: 1,
    }),
  )
  it(
    ...makeCase({
      direction: "L",
      amount: 30,
      expectedPosition: 52,
      expectedZeros: 0,
    }),
  )
  it(
    ...makeCase({
      direction: "R",
      amount: 48,
      expectedPosition: 0,
      expectedZeros: 1,
    }),
  )
  it(
    ...makeCase({
      direction: "L",
      amount: 5,
      expectedPosition: 95,
      expectedZeros: 0,
    }),
  )
  it(
    ...makeCase({
      direction: "R",
      amount: 60,
      expectedPosition: 55,
      expectedZeros: 1,
    }),
  )
  it(
    ...makeCase({
      direction: "L",
      amount: 55,
      expectedPosition: 0,
      expectedZeros: 1,
    }),
  )
  it(
    ...makeCase({
      direction: "L",
      amount: 1,
      expectedPosition: 99,
      expectedZeros: 0,
    }),
  )
  it(
    ...makeCase({
      direction: "L",
      amount: 99,
      expectedPosition: 0,
      expectedZeros: 1,
    }),
  )
  it(
    ...makeCase({
      direction: "R",
      amount: 14,
      expectedPosition: 14,
      expectedZeros: 0,
    }),
  )
  it(
    ...makeCase({
      direction: "L",
      amount: 82,
      expectedPosition: 32,
      expectedZeros: 1,
    }),
  )
})
