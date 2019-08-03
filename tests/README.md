When testing, make sure you have added a value called `SAUCENAO_TOKEN` to your enviroment variables with the value of your SauceNao token.

**On MacOS / Linux / Windows when using Git Bash or WSL**
- Run `export SAUCENAO_TOKEN=your_token` from the same terminal you're running the tests from
- Or more reliably, add this line to your `~/.bashrc` / `~/.profile` / `~/.zsrc` etc.

**On Windows**
- Open your system settings through one of these methods:
  - Windows + Pause/Break keyboard shortcut
  - Control Panel -> System and Security -> System
  - File Explorer window -> right click "This PC" -> Properties
- Open `Advanced System Settings` on the left
- Open `Environment Variables...`
- At `System variables` press `New...`
- At `Variable name` fill in `SAUCENAO_TOKEN`
- At `Variable value` fill in your token
- Press `OK`
- Close out of all the windows we navigated through