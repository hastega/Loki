<br/>
<h1 align="center">
    BE - Node Proxy Cache Server
</h1>

<br/>

Node and Express SK to use as develop support of remote BE. 

<hr/>


## Feature

- Layer of custom mocked API, with data stored in a JSON file, that can be use alongside the remote API.

- Proxy to remote endpoint.

## Next Implementations

- Implement caching remote API response

- Unify local JSON db and Cache DB (Redis? JSON file?) and make it easily editable.

- Set a JSON congif file to setup common task (endpoint, forcing cache, etc..)

- API definition from JSON-OpenAPI

- Custom middleware implementation

## How to run

have Redis installed on machine.

- Clone the repo and install requirments.

- run the Venv.

- make database migrations.

- > `npm install`

For Dev environment 

- > `npm run dev` 

For Prod

- > `npm run build`

- > `npm run start` 

