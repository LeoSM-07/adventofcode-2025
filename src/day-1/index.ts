import { FileSystem } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import { Effect, Layer, Logger, Schema, Stream } from "effect"

export const Direction = Schema.Literal("L", "R")
export type Direction = typeof Direction.Type

const RotationTuple = Schema.TemplateLiteralParser(
  Direction,
  Schema.NonNegativeInt,
)

export class Rotation extends Schema.Class<Rotation>("Rotation")({
  direction: Direction,
  amount: Schema.NonNegativeInt,
}) {
  static fromString = Schema.transform(
    RotationTuple,
    Schema.typeSchema(Rotation),
    {
      decode: ([direction, amount]) => Rotation.make({ direction, amount }),
      encode: (r) => [r.direction, r.amount] as const,
    },
  )

  override toString() {
    return `${this.direction}${this.amount}`
  }

  apply(input: number) {
    const range = 100
    const dir = this.direction === "L" ? -1 : 1

    const clicks = Math.floor(this.amount / range)
    const rotation = this.amount % range

    let zeroHits = clicks
    let newPosition = input

    if (this.direction === "R") {
      if (newPosition + rotation >= range) {
        zeroHits += 1
      }
      newPosition = (newPosition + rotation) % range
    } else {
      if (newPosition !== 0 && newPosition - rotation <= 0) {
        zeroHits += 1
      }
      newPosition = (newPosition - rotation + range) % range
    }

    return { newPosition, zeroHits }
  }
}

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const { part1Count, part2Count } = yield* fs
    .stream("./src/day-1/input.txt")
    .pipe(
      Stream.decodeText(),
      Stream.splitLines,
      Stream.filter((line) => line.length > 0),
      Stream.mapEffect(Schema.decodeUnknown(Rotation.fromString)),
      Stream.runFold(
        { part1Count: 0, part2Count: 0, position: 50 },
        ({ part1Count, part2Count, position }, rotation) => {
          const { newPosition, zeroHits } = rotation.apply(position)

          return {
            part1Count: newPosition === 0 ? part1Count + 1 : part1Count,
            part2Count: part2Count + zeroHits,
            position: newPosition,
          }
        },
      ),
    )

  yield* Effect.logInfo(`Final count for part 1 is: ${part1Count}`)
  yield* Effect.logInfo(`Final count for part 2 is: ${part2Count}`)
})

const appLayer = Layer.mergeAll(Logger.pretty, BunFileSystem.layer)

Effect.runPromise(program.pipe(Effect.provide(appLayer)))
