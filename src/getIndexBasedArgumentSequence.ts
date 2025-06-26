import { getArgument } from "cli-argument-helper";
import getBooleanArgumentFromIndex from "cli-argument-helper/getBooleanArgumentFromIndex";
import assert from "node:assert";

export default function getIndexBasedArgumentSequence(
  args: string[],
  name: string,
  finisher: string,
) {
  const begin = getArgument(args, name);

  if (begin === null) {
    return null;
  }

  const sequence = new Array<string>();
  let finished = false;
  while (args.length && !finished) {
    finished = getBooleanArgumentFromIndex(args, begin.index, finisher);

    if (finished) {
      break;
    }

    const value = args.splice(begin.index, 1)[0] ?? null;

    if (value === null) {
      break;
    }

    sequence.push(value);
  }

  assert.strict.ok(
    finished,
    `The ${name} argument must be followed by a semicolon at the end.`,
  );

  return sequence;
}
