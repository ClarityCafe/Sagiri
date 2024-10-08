import { expect, test } from "bun:test";
import sagiri from "../../src/sagiri";
import { env } from "node:process";

test("Should fail on invalid characters", () => {
  env.NODE_ENV = "production";
  expect(() => {sagiri("!!!!!*&#@(!)")}).toThrow(Error);
})

test("Should fail on invalid length", () => {
  env.NODE_ENV = "production";
  expect(() => {sagiri("7".repeat(27))}).toThrow(Error);
})

test("Resolve with results", async () => {
  const result = await sagiri(env.SAUCENAO_TOKEN as string, { results: 5 })("https://i.imgur.com/F9QSgPx.jpeg");
  console.log(result);
  expect(result).toBeDefined();
})
