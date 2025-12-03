import { FileSystem } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import { Effect, Layer, Logger, Schema, Stream } from "effect"

const Line = Schema.Array(Schema.NumberFromString)
type Line = typeof Line.Type

function findJoltage(line: Line, n: number): number {
  if (n <= 0 || line.length === 0) return 0
  if (n >= line.length) return Number(line.join(""))

  const stack: number[] = []
  let toRemove = line.length - n

  for (const digit of line) {
    while (
      toRemove > 0 &&
      stack.length > 0 &&
      stack[stack.length - 1]! < digit
    ) {
      stack.pop()
      toRemove--
    }
    stack.push(digit)
  }

  const best = stack.slice(0, n)
  return Number(best.join(""))
}

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const { part1, part2 } = yield* fs.stream("./src/day-3/input.txt").pipe(
    Stream.decodeText(),
    Stream.splitLines,
    Stream.mapEffect((line) =>
      Schema.decodeUnknown(Line)(line.trim().split("")),
    ),
    Stream.runFold({ part1: 0, part2: 0 }, (total, line) => {
      return {
        part1: total.part1 + findJoltage(line, 2),
        part2: total.part2 + findJoltage(line, 12),
      }
    }),
  )

  yield* Effect.logInfo(`Part 1: ${part1}`)
  yield* Effect.logInfo(`Part 1: ${part2}`)
})

const appLayer = Layer.mergeAll(Logger.pretty, BunFileSystem.layer)

Effect.runPromise(program.pipe(Effect.provide(appLayer)))
