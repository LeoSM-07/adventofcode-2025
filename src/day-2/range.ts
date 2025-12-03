import { Schema } from "effect"

const RangeTuple = Schema.TemplateLiteralParser(
  Schema.NonNegativeInt,
  Schema.Literal("-"),
  Schema.NonNegativeInt,
)

export class Range extends Schema.Class<Range>("Range")({
  start: Schema.NonNegativeInt,
  end: Schema.NonNegativeInt,
}) {
  static fromString = Schema.transform(RangeTuple, Schema.typeSchema(Range), {
    decode: ([start, _, end]) => Range.make({ start, end }),
    encode: (r) => [r.start, "-", r.end] as const,
  })

  calculateIdSum() {
    let part1Sum = 0
    let part2Sum = 0
    for (let i = this.start; i <= this.end; i++) {
      const str = i.toString()
      const len = str.length

      // part 1
      if (str.substring(0, len / 2) === str.substring(len / 2)) {
        part1Sum += i
      }

      // part 2
      for (let subLen = 1; subLen <= len / 2; subLen++) {
        if (len % subLen !== 0) continue

        const segment = str.slice(0, subLen)
        const repeated = segment.repeat(len / subLen)

        if (repeated === str) {
          part2Sum += i
          break
        }
      }
    }

    return { part1Sum, part2Sum }
  }
}
