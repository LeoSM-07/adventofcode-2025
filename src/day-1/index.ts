import { FileSystem } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import {
  Effect,
  Layer,
  Logger,
  ParseResult,
  pipe,
  Schema,
  Stream,
} from "effect"

class Rotation extends Schema.Class<Rotation>("Rotation")({
  direction: Schema.Literal("L", "R"),
  amount: Schema.NonNegativeInt,
}) {
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

export const RotationFromString = Schema.transformOrFail(
  Schema.String,
  Rotation,
  {
    strict: true,
    decode: (input, _, ast) => {
      const direction = input.at(0)
      const amount = parseInt(input.substring(1))
      if (!direction || (direction !== "L" && direction !== "R")) {
        return ParseResult.fail(
          new ParseResult.Type(
            ast,
            input,
            `Failed to parse direction from string ${input}`,
          ),
        )
      } else if (isNaN(amount)) {
        return ParseResult.fail(
          new ParseResult.Type(
            ast,
            input,
            "Failed to prase amount from string",
          ),
        )
      }
      return ParseResult.succeed(Rotation.make({ amount, direction }))
    },
    encode: (input) => ParseResult.succeed(input.toString()),
  },
)

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const fileString = yield* fs.readFileString("./src/day-1/input.txt")
  const lines = fileString.split("\n").slice(0, -1)

  const { count } = yield* pipe(
    Stream.fromIterable(lines),
    Stream.mapEffect(Schema.decodeUnknown(RotationFromString)),
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
