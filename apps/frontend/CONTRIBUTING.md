## Integraflow frontend

This is the development monorepo of integraflow.

Nice of you to want to contribute. First, make a copy of the required environment variables and replace them with the correct keys.

```shell
  cp .env.example .env
```

You can reach out to one of the maintainers so they can walk you through. Because this project is a monorepo, you need to use the aforementioned command in the root directory and in the frontend directory &mdash; `/apps/frontend`.

## Setting up

In the root directory, run the command below to build the database/server It may take a while, please be a liitle bit patient.

```shell
docker compose build
```

If you're on any distro of Linux/Ubuntu, you need to append `sudo` right before `docker compose build`. When the build is complete, use the command below to start the server.

```shell
docker compose up
```

**PS: Remember to append the `sudo` keyword if you're on any linux or ubuntu distros.**

If you want to stop docker from requesting for permission everytime, you can add your use to the `docker` group.

- Run the command to add your user to the docker group. You can replace `$USER` with your actual user name if doesn't work at first.

```shell
  sudo usermod -aG $USER
```

- After running this command, you'll need to log out and log back in for the changes to take effect. Alternatively, you can run the following command to apply the changes to your current session:

```shell
newgrp docker
```

After following the steps above, you should be able to user the `docker compose` command without the `sudo` flag.
