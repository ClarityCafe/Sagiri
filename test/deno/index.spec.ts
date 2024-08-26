import { assertEquals, assertExists } from "@std/assert";
import sagiri from "../../lib/sagiri";

Deno.test("should fail on invalid characters", () => {
  assertEquals(() => {sagiri("!!!!!*&#@(!)")}, Error);
});

Deno.test("should fail on invalid length", () => {
  assertEquals(() => {sagiri("7".repeat(27))}, Error);
});

Deno.test("Resolve with results", () => {
  assertExists(()=> {});
})
