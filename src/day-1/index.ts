import { FileSystem } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import { Effect, Layer, Logger, pipe, Schema, Stream } from "effect"

const Direction = Schema.Literal("L", "R")
const RotationTuple = Schema.TemplateLiteralParser(
  Direction,
  Schema.NonNegativeInt,
)

class Rotation extends Schema.Class<Rotation>("Rotation")({
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
    let newPosition = input

    switch (this.direction) {
      case "L":
        newPosition = input - this.amount
        break
      case "R":
        newPosition = input + this.amount
        break
    }

    // scales from [0,99] even if we rotate more than 100
    newPosition = ((newPosition % 100) + 100) % 100

    return newPosition
  }
}

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const fileString = yield* fs.readFileString("./src/day-1/input.txt")
  const lines = fileString.split("\n").slice(0, -1)

  const { count } = yield* pipe(
    Stream.fromIterable(lines),
    Stream.mapEffect(Schema.decodeUnknown(Rotation.fromString)),
    Stream.tap((n) => Effect.logDebug(n.toString())),
    Stream.runFold(
      { count: 0, position: 50 },
      ({ count, position }, rotation) => {
        const updated = rotation.apply(position)

        return { count: updated === 0 ? count + 1 : count, position: updated }
      },
    ),
  )

  yield* Effect.logInfo(`Final count is: ${count}`)
})

const appLayer = Layer.mergeAll(Logger.pretty, BunFileSystem.layer)

Effect.runPromise(program.pipe(Effect.provide(appLayer)))
