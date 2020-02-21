When testing, make sure you have added a value called `SAUCENAO_TOKEN` to your enviroment variables with the value of your SauceNao token.

## How to

- Remove `.sample` from the `.env` file in the `fixtures` folder (`tests/fixtures/.env` from project root).
- Add your token after the `=` at `SAUCENAO_TOKEN=`

## For CI environments

- Add the environment variable to the CI enviroment settings.
  How this works depends on the CI service, so look up documentation for your service.
