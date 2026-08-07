# React and Redux with redux-promise

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

An easy, basic and raw (no styles attached) example of **HOW to** do async work in
`redux` with `redux-promise`. It fetches a list of users and renders it.

One of three sibling repos that build the **same app** with different middleware, so
the diff between them is the lesson:

| Repo | Middleware |
| --- | --- |
| [react-redux-example-redux-thunk](https://github.com/alpersonalwebsite/react-redux-example-redux-thunk) | `redux-thunk` |
| **this one** | `redux-promise` |
| [react-redux-example-redux-saga](https://github.com/alpersonalwebsite/react-redux-example-redux-saga) | `redux-saga` |

## The whole of redux-promise

Return an action whose **payload is a promise**. The middleware waits for it and
re-dispatches the same action with the resolved value in the payload's place, so the
reducer only ever sees a settled value:

```js
export const fetchUsers = () => ({
  type: FETCH_USERS,
  payload: axios.get(API, { params: { limit: 10 } }).then(res => readUsers(res.data))
})
```

That is the entire API. Compare with the thunk version, which returns a **function**
and calls `dispatch` itself.

## What the small API costs you

**There is no "started" moment.** The action creator returns once and the middleware
does the rest, so there is nothing to hang a loading flag on. The reducer here starts
with `loading: true` and turns it off when the result lands, which works for one fetch
on mount and does not generalise. The saga sibling has a real `FETCH_USERS_REQUESTED`
action for exactly this reason, and this app has no Retry button because of it.

**Failure is one boolean.** On rejection, redux-promise re-dispatches with
`error: true` and the rejection as the payload, following the
[Flux Standard Action](https://github.com/redux-utilities/flux-standard-action)
convention. That flag is the whole failure channel:

```js
if (action.error) {
  return { items: [], loading: false, error: action.payload.message }
}
```

**No cancellation.** Two overlapping requests both land, and the slower one wins. The
saga version fixes that with one word (`takeLatest`).

`redux-promise` has not shipped since 2018. It is here because it is the simplest
possible answer, and knowing where "simplest" stops being enough is the point of
comparing the three.

## Pointing it at an API

`REACT_APP_API_URL`, defaulting to `http://localhost:3333/api/users`, which is
[node-express-postgresql](https://github.com/alpersonalwebsite/node-express-postgresql)
running locally.

```shell
cp .env.example .env      # then edit it, .env is gitignored
```

Create React App **inlines** `REACT_APP_` variables into the bundle at build time, so an
endpoint URL is fine there and a token is not.

## Installation

```shell
npm ci
npm start
npm run lint
npm test
npm run build
```

There is an `.npmrc` setting `legacy-peer-deps=true`: `eslint` is pinned at `^5.16.0`
while `eslint-config-standard@^13.0.1` declares a peer of `eslint >= 6.0.1`, and npm 7+
refuses to install over that. The two work together in practice, so this restores npm
6's behaviour rather than moving a pin.

**On Node 17 or newer `npm run build` fails** with `ERR_OSSL_EVP_UNSUPPORTED`: webpack 4
asking OpenSSL 3 for MD4. Pass the flag:

```shell
NODE_OPTIONS=--openssl-legacy-provider npm run build
```
