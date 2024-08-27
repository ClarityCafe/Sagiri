import { assertEquals, assertExists } from "@std/assert";
import sagiri from "../../lib/sagiri.ts";

Deno.test("should fail on invalid characters", () => {
  assertEquals(() => {sagiri("!!!!!*&#@(!)")}, Function);
});

Deno.test("should fail on invalid length", () => {
  assertEquals(() => {sagiri("7".repeat(27))}, Function);
});

Deno.test("Resolve with results", () => {
  assertExists(()=> {sagiri(Deno.env.get("SAUCENAO_TOKEN")!)("https://i.imgur.com/F9QSgPx.jpeg")}, "pixiv");
})
