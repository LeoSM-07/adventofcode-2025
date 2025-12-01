import type { Effect } from "effect/Effect"
import type { Schema } from "effect/Schema"
import { Rotation } from "."

export const RotationFromString = Schema.transformOrFail(
  Schema.String,
  Rotation,
  {
    strict: true,
    decode: (input, _options, ast) => {
      const dir = input.at(0)
      const numPart = input.substring(1)

      if (dir !== "L" && dir !== "R") {
        return Effect.fail(
          ParseIssue.type(
            ast,
            input,
            "Rotation string must start with 'L' or 'R'",
          ),
        )
      }

      const amount = parseFloat(numPart)
      if (isNaN(amount)) {
        return Effect.fail(
          ParseIssue.type(ast, input, "Invalid rotation amount"),
        )
      }

      // If all good, return as an Effect
      return Effect.succeed({ direction: dir, amount } as const)
    },
    encode: (rotation, _options, _ast) =>
      Effect.succeed(`${rotation.direction}${rotation.amount}`),
  },
)
