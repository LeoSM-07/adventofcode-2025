import { FileSystem } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import { Effect, Layer, Logger, Schema, Stream } from "effect"

const Line = Schema.Array(Schema.NumberFromString)
type Line = typeof Line.Type

function findJoltage(line: Line): number {
  let maxJoltage = 0
  let maxLeft = -1

  for (const current of line) {
    if (maxLeft !== -1) {
      const joltage = maxLeft * 10 + current
      if (joltage > maxJoltage) {
        maxJoltage = joltage
      }
    }

    if (current > maxLeft) {
      maxLeft = current
    }
  }

  return maxJoltage
}

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const test = yield* fs.stream("./src/day-3/input.txt").pipe(
    Stream.decodeText(),
    Stream.splitLines,
    Stream.mapEffect((line) =>
      Schema.decodeUnknown(Line)(line.trim().split("")),
    ),
    Stream.runFold(0, (total, line) => {
      return (total += findJoltage(line))
    }),
  )

  yield* Effect.logInfo(`Part 1: ${test}`)
})

const appLayer = Layer.mergeAll(Logger.pretty, BunFileSystem.layer)

Effect.runPromise(program.pipe(Effect.provide(appLayer)))
