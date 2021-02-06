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

Start the kubernetes environment:

```shell
$ task k8s:start
```

**Database**: [CockroachDB][].

Deploy a new empty database on your local kubernetes:

```shell
$ task db:deploy
$ kubectl get pods -w # watch cluster come up
$ task db:shell # access database shell
```

[go]: https://golang.org
[docker]: https://www.docker.com/products/docker-desktop
[taskfile]: https://taskfile.dev/#/
[minikube]: https://minikube.sigs.k8s.io/docs/
[kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[CockroachDB]: https://www.cockroachlabs.com/docs/stable/index.html
[helm]: https://helm.sh
