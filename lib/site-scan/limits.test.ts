import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ConcurrencyGate } from "./limits.ts";

describe("ConcurrencyGate", () => {
  it("limits concurrent executions", async () => {
    const gate = new ConcurrencyGate(1);
    let active = 0;
    let maxActive = 0;

    const task = async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 20));
      active -= 1;
    };

    await Promise.all([gate.run(task), gate.run(task), gate.run(task)]);
    assert.equal(maxActive, 1);
  });
});

describe("checkTargetDomainScanLimit", () => {
  it("exports a domain scan limit helper", async () => {
    const { checkTargetDomainScanLimit } = await import("./limits.ts");
    const first = checkTargetDomainScanLimit("example.com");
    assert.equal(first.allowed, true);
  });
});
