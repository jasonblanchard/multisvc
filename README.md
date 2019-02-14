# Microservices PoC using Kubernetes

## Local build
Start minikube

```
minikube start
```

Get everything running
```
$ kubectl create -f ops/
$ kubectl create -f auth/ops/
$ kubectl create -f echo/ops/
```

If you make changes to a resource config file, apply it like this:

```
$ kubectl apply -f auth/ops/
```

Find gateway URL
```
$ minikube services list
```
Grab the URL for `ambassador`.

Visit `<URL>/auth/health`

## Run tests
```
$ cd tests/
$ CYPRESS_NODE_PORT=<URL> npm run tests:run
```

To run the tests in a browser (with dangling state for development):
```
$ cd tests/
$ CYPRESS_NODE_PORT=<URL> npm run tests:open
```

## Swaping out cluster deployments with local builds
This is handy for local development of a container against the running cluster.

First, [install telepresence](https://www.telepresence.io/reference/install) then follow [this dev workflow guide](https://www.telepresence.io/tutorials/docker). For example:

```
$ cd echo
$ telepresence --swap-deployment echo --docker-run --rm -v $(pwd)/src:/home/app/src jasonblanchard/multisvc-echo:4 npm run watch
```

The `echo` deployment should be proxying against this local container. Changes you make locally should show up.

Combine this with the above test command to open a browser and you can use the dangling state to sign in, etc.