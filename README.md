# ledger

## Development

**Setup:**

Install the following tooling:

1. [go][] - the main programming language for this project
1. [taskfile][] - task runner and build tool written in go
2. [docker][] - container builder and runtime
3. [minikube][] - local kubernetes development instance ( will install kubectl as well )
4. [kubectl][] - kubernetes controller
5. [helm][] - kubernetes package manager

If you are using homebrew for [MacOS](https://brew.sh) or [Linux](https://docs.brew.sh/Homebrew-on-Linux),
A `Brewfile` is checked into this repo for easy setup. If you add to this list, please update the `Brewfile`

```shell
$ brew bundle
```

**Run the app**:

1. Start docker ( OSX: `open -a Docker` )
2. Deploy a new database on docker
  ```shell
  $ task db:start
  ```
3. Start the web server
  ```shell
  $ task web:start
  ```
4. Ensure environment file is correct `web/.env`
5. Navigate to the localhost:{port} printed in the console
## Testing

**Feature Testing**

Feature acceptance testing is done via [godog](https://github.com/cucumber/godog)

[go]: https://golang.org
[docker]: https://www.docker.com/products/docker-desktop
[taskfile]: https://taskfile.dev/#/
[minikube]: https://minikube.sigs.k8s.io/docs/
[kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[postgresql]: https://www.postgresql.org
[helm]: https://helm.sh
