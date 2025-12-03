import { Args, Command } from "@effect/cli"
import { FileSystem } from "@effect/platform"
import { BunContext, BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { pathToFileURL } from "bun"
import { Console, Effect, Schema, Stream } from "effect"

const FolderTuple = Schema.TemplateLiteralParser(
  Schema.Literal("day-"),
  Schema.NonNegativeInt,
)

const maxDay = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const maxDay = yield* Stream.fromIterableEffect(
    fs.readDirectory("./src"),
  ).pipe(
    Stream.filter((s) => s.includes("day")),
    Stream.mapEffect(Schema.decodeUnknown(FolderTuple)),
    Stream.runFold(0, (max, [_, current]) => {
      return current > max ? current : max
    }),
  )

  return maxDay
}).pipe(Effect.provide(BunFileSystem.layer))

const day = Args.integer({ name: "day" }).pipe(
  Args.withSchema(
    Schema.Int.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.filterEffect((num) =>
        Effect.gen(function* () {
          const max = yield* maxDay.pipe(Effect.orDie)
          return num <= max
        }),
      ),
    ),
  ),
)

// run "./src/index.ts"
const run = Command.make("run", { day }, ({ day }) =>
  Effect.gen(function* () {
    const filePath = `./src/day-${day}/index.ts`

    yield* Console.log(`Executing ${filePath}...`)

    // Dynamically import the module for the given day
    const module = yield* Effect.tryPromise({
      try: async () => await import(pathToFileURL(filePath).href),
      catch: (err) => new Error(`Failed to load ${filePath}: ${err}`),
    })
  }),
)

const cli = Command.run(run, {
  name: "aoc-2025",
  version: "1.0.0",
})

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain)
