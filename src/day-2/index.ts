import { FileSystem } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import { Effect, Layer, Logger, Schema, Stream } from "effect"
import { Range } from "./range"

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const { part1Sum, part2Sum } = yield* fs.stream("./src/day-2/input.txt").pipe(
    Stream.decodeText(),
    Stream.mapConcat((s) => s.trimEnd().split(",")),
    Stream.mapEffect(Schema.decodeUnknown(Range.fromString)),
    Stream.runFold(
      { part1Sum: 0, part2Sum: 0 },
      ({ part1Sum, part2Sum }, range) => {
        const result = range.calculateIdSum()
        return {
          part1Sum: part1Sum + result.part1Sum,
          part2Sum: part2Sum + result.part2Sum,
        }
      },
    ),
  )

  yield* Effect.logInfo(`Part 1: ${part1Sum}`)
  yield* Effect.logInfo(`Part 2: ${part2Sum}`)
})

const appLayer = Layer.mergeAll(Logger.pretty, BunFileSystem.layer)

Effect.runPromise(program.pipe(Effect.provide(appLayer)))
