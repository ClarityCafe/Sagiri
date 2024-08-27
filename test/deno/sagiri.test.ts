import { assertIsError, assertExists } from "@std/assert";
import sagiri from "../../lib/sagiri.ts";

Deno.test("should fail on invalid characters", () => {
  assertIsError(sagiri("!!!!!*&#@(!)"));
});

Deno.test("should fail on invalid length", () => {
  assertIsError(sagiri("7".repeat(27)));
});

Deno.test("Resolve with results", () => {
  assertExists(()=> {sagiri(Deno.env.get("SAUCENAO_TOKEN")!)("https://i.imgur.com/F9QSgPx.jpeg")}, "pixiv");
})
