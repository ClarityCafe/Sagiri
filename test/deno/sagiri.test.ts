import { assertIsError, assertExists } from "@std/assert";
import sagiri from "../../lib/sagiri.ts";

Deno.test("should fail on invalid characters", () => {
  assertIsError(sagiri("!!!!!*&#@(!)"), Error);
});

Deno.test("should fail on invalid length", () => {
  assertIsError(sagiri("7".repeat(27)), Error);
});

Deno.test("Resolve with results", () => {
  assertExists(()=> {sagiri(Deno.env.get("SAUCENAO_TOKEN")!)("https://i.imgur.com/F9QSgPx.jpeg")}, "pixiv");
})
