<br/>
<h1 align="center">
    Mock Server
</h1>

<br/>

Node and Express Starter Kit to use as support for developers. 

This server has multiple features:
    - it has a boilerplate for authenticated routes
    - it has costumizabile proxy
    - it has redis cache integration (currently only for: GET)
    - it has local database usable as response to an endpoint (currently only for: GET)

<hr/>


## Feature

- Layer of custom mocked API, with data stored in a JSON file, that can be use alongside the remote API.

- Proxy to remote endpoint.

## Next Implementations

- Define and implemen response for other methods in cache server

- API definition from JSON-OpenAPI

- Custom middleware implementation


## How to run

create .env file following the example

Have Redis installed on machine.

- Clone the repo and install requirments.

- > `npm install`

For Dev environment 

- > `npm run dev` 

For Prod

- > `npm run build`

- > `npm run start` 

## How to use:


- ### Web Socket

The main purpose of this feature is to create a simple websocket connection, after configuring the WSPORT in the .env file you can can create a ws conntection that will send you a simple response. the response and the interval of response are editabile in `config/default.json`.

- ### Local Database

The main purpose of this feature is to have a mocked and fast editable database so that we can have ready to use endpoints. 

<pre>

.
├── build                   # Compiled files 
├── config                  # configuration files
├── src                     # Source files
├── static                  # Static files
├── yourlocaldb             # Dynamic and Editable database
├── db.json                 # Plain json database 
├── tsconfig.json          
├── LICENSE
└── README.md

</pre>

In order to use the local database without having any backend you have to make the structure of the folder considering that every folder is a callable endpoint and the nesting of these folders compose the endpoint, for example:

we would like to have a list of users that are working on a project, so we have to interrogate an API that will look like this:

> `hastega.it/v1/projects/AAA/users`

to have one response we have to create in our root directory the following folders and the following json files

<pre>
.
│
├─hastega.it
│ └──v1           
│    └──projects           
│        └── AAA         
│             └──users
│                 ├──.json 
│                 └──start_1_limit_30.json
.

</pre>

and when we will interrogate the followings APIs

> `localhost:4201/lcache/hastega.it/v1/projects/AAA/users`

> `localhost:4201/lcache/hastega.it/v1/projects/AAA/users?start=1&limit=30`

we will recieve the followings responses

```
  "error": false,
  "cache": false,
  "message": "here/'s the fetched data",
  "data": (.json file)
```

```
  "error": false,
  "cache": false,
  "message": "here/'s the fetched data",
  "data": (start_1_limit_30.json file)
```

Is possible to use specific json files for specific values of the query parameters, in fact the naming convention uses query parameters to read or create the json files