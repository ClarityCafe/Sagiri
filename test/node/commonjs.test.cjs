/* eslint-disable @typescript-eslint/no-require-imports */
const process = require("process");
// this is so arbitrary holy shit
const sagiriOnCjs = require("../../dist/sagiri.cjs");

test("Resolve using Commonjs", async() => {
  const result = await sagiriOnCjs(process.env.SAUCENAO_TOKEN, { results: 5 })("https://i.imgur.com/F9QSgPx.jpeg");
  console.log(result);

  expect(sagiriOnCjs).toBeDefined();
  expect(result).toBeDefined();
})
