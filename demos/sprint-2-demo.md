# Sprint 2 Demo

1. Feature planning and Cucumber

    1. Visit [plan](https://github.com/rooftopsparrow/ledger/issues/26)
    2. Visit [board](https://github.com/rooftopsparrow/ledger/projects)
    3. Show feature files

      ```shell
      $ godog
      ```

2. Demonstrate User Storage and JWT

    1. Signup for account

      ```sh
      task db:start
      task web:start
      # Fill out form
      # Split to new shell
      task db:shell
      select * from users
      ```

    2. Show JWT working

      ```sh
      # copy token output
      # navigate to jwt.io
      # fill out secret
      # paste token
      ```
