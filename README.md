<a name="readme-top"></a>

<center>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
</center>






<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://www.hastega.it/">
    <img src="static/images/logo-hastega-bianco-v.png" alt="Temporary Logo" height="260px">
  </a>

  <h1 align="center">LOKI</h1>

  <p align="center">
    An utility Node server to support frontends development
    <br />
    ·
    <a href="https://github.com/hastega/Loki/issues">Report Bug</a>
    ·
    <a href="https://github.com/hastega/Loki/issues">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <!-- <li><a href="#contributing">Contributing</a></li> -->
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

As a software house, during times, working on various frontends we often get our work stuck by the delay in receiving working backends. So we've built this server: LOKI is infact a temporary sobstitute of backend logic that permit to not stop the development of frontend. 

We've built it with various utilities that we've used, and still use on a daily base, to serve frontends with the logic needed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][Node-url]
* [![Typescript][Typescript.org]][Typescript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started



- Clone the repo and install requirments.

- > `nvm use`
- > `npm install`

> **Note:** While we previously required creating a `.env` file from `example.env`, this is no longer necessary as environment variables are now managed through the `processEnv.manager.ts` module. The application will use default values if environment variables are not provided.

For Dev environment 

- > `npm run dev` 
  
Remember that you need to have Redis installed on your machine if you want to use the Redis feature.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## FEATURE USAGE

- ## WEB SOCKET

The main purpose of this feature is to create a simple Web Socket connection, after configuring 
```js
  WEB_SOCKET_PORT = 'YOUR-WEB-SOCKET-PORT';
```
   
in the `.env` file you can create a Web Socket conntection that will send you a simple response. The response and the interval of response are editabile in `config/default.json`.

```json
"websocket": {
        "responseMessage": "The response you want",
        "setInterval": false, // Interval selector
        "interval": 5000 // Interval time
    }
```
---
- ## LOCAL DATABASE

The main purpose of this feature is to have a mocked and fast editable database so we can fastly create and have ready to use endpoints.

<pre>
.
├── build                   # Compiled files 
├── config                  # configuration files
├── src                     # Source files
├── static                  # Static files
├── dbDirectory             # Dynamic and Editable database for Local Database Feature <-
├── db.json                 # Plain json database for JSONServer Feature 
├── tsconfig.json          
├── LICENSE
└── README.md
</pre>

Let's consider two different use cases:

- No backend's endpoints to interrogate

The Local Database feature is useful when there aren't any backend's endpoints to interrogate. Infact you could make the structure of the dbDirectory folder considering that every folder is a callable endpoint and the nesting of these folders compose the endpoint path, and the name of the dbDirectory is the domain of the endpoint.

Let's assume we would like to have a list of users that are working on a project, and assume that the endpoint will look like this one:

> `hastega.it/v1/projects/projectId/users`

So we will build our dbDirectory in this way

<pre>
.
├─hastega.it                     #dbDirectory name
│ └──v1           
│    └──projects           
│        └── projectId         
│                 └──users
│                     └─.json    #json file with response data
│
.
</pre>

In order to have a usable response we have to create in our last sub-directory a `.json` (dot-json) file that will contain the desired response, and finally we could interrogate the following endpoint to fake the backend api.

Considering the following configuration in the `.env` file 

```js
  LOCAL_DATABASE_PORT = 4201;
```
the fake endpoint 

> `localhost:4201/lcache/hastega.it/v1/projects/projectId/users`

will give us the following response: 

```
  "error": false,
  "cache": false,
  "message": "here/'s the fetched data",
  "data": (.json file)
```

This feature support also the query params but a more comprehensive example of their usage will be provide in the next use case.

- Backend's endpoints to interrogate

Let's consider that the previous example 

> `hastega.it/v1/projects/projectId/users`

will response us with the users list. If we will interrogate the endpoint 

> `localhost:4201/lcache/hastega.it/v1/projects/projectId/users`

all the dbDirectory structure will be created automatically and also the `.json` file following the endpoint original response. All the next interrogation will be served by the `.json` file and its edits, in order to have an easy accessible file to fast edit the response. If in the endpoint will be used query params the file created will have a name with the description of query params:

> `localhost:4201/lcache/hastega.it/v1/projects/AAA/users?start=1&limit=30`

`start_1_limit_30.json`

and those files will be use in respose on relative endpoint request. 

- Usage with https and custom headers

Loki is able to interrogate also custom headers needed endpoints. To correctly pass, without any problems, all the custom headers can be used the middleware `setHeader()` inside the desired route.

It accepts an array of string and has the role to parse correctly the headers inside the axios config request. 

```js
router.get("*", setHeader(["CUSTOM_AUTH_HEADER", "ANOTHER_NEEDED_HEADER"]), getLocalCache);
```
To semplify the usage you could use also the `config/default.json`

```json
"localDatabase": {
        "customHeaders": ["CUSTOM_AUTH_HEADER", "ANOTHER_NEEDED_HEADER"],
        "rejectUnauthorized": false,
    }
```
As you can see there is also another config key `rejectUnauthorized` that can be set to `true` to use axios with https request if is needed

Another usage of the Local Database feature is the `nocache` mode, which was recently added. This mode allows us to use the endpoint with an additional parameter `/nocache`. This parameter ensures that during certain stages of development, our website will be reachable and usable with updated data from the database.

Let's consider a scenario where, at the starting point of our server application, no endpoint is interrogable. Initially, we need to manually build the folder tree as described in the first paragraph. After some time, once our first endpoint becomes operational, we can delete our local database files.

If we interrogate the endpoint again, the folder tree and JSON file will be automatically created, allowing us to start working on it immediately.

Now, suppose we have significantly edited the data locally. By adding the `nocache` parameter to our URL, all folders and files in the local database will be updated with fresh data fetched directly from the server. This ensures that the latest server data is always available when needed.


- ## JSON SERVER

JSON Server is a feature that allows you to create a simple REST API based on a JSON file. In Loki, this feature uses the `db.json` file in the project root.

### Configuration
The `db.json` file must contain a JSON object with the entities you want to expose as endpoints. For example:

```json
{
  "users": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
  ],
  "projects": [
    { "id": 1, "title": "Project A", "userId": 1 },
    { "id": 2, "title": "Project B", "userId": 2 }
  ]
}
```

### Usage
Once the `db.json` file is configured, you can use the following endpoints:

- `GET /users` - Gets the list of all users
- `GET /users/1` - Gets the user with id 1
- `POST /users` - Creates a new user
- `PUT /users/1` - Fully updates the user with id 1
- `PATCH /users/1` - Partially updates the user with id 1
- `DELETE /users/1` - Deletes the user with id 1

The same patterns apply to all entities defined in the `db.json` file.

### Filters and Queries
You can use various query parameters to filter the results:

- `GET /users?name=John` - Filters users by name
- `GET /projects?userId=1` - Filters projects by userId
- `GET /users?_sort=name&_order=desc` - Sorts users by name in descending order
- `GET /users?_page=1&_limit=10` - Pagination: page 1 with 10 items per page

### Multi-Database Configuration

An important feature of Loki is the ability to manage multiple database configurations for different domains. This is particularly useful when working with microservices or distributed APIs.

For example, if you need to simulate two different APIs such as:
- `athena.it/api/v1/users`
- `efesto.it/api/v2/projects`

Loki can handle both through JSON Server endpoints, automatically creating separate JSON files for each domain when it can't reach the remote server.

When Loki receives a request for an unavailable endpoint, it will create a JSON file in the configured directory (default `.db`) with the appropriate structure, allowing you to simulate responses for different domains simultaneously.

Each domain will have its own independent file and directory structure, allowing you to keep the different simulated APIs separate.

- ## REDIS SERVER

The Redis functionality in Loki allows you to use Redis as a cache for API responses. This is particularly useful when you need to make frequent calls to external endpoints that don't change their data often.

### Prerequisites
- Redis must be installed and running on your system
- Redis configuration must be specified in the `config/default.json` file:

```json
"redis": {
    "hostname": "localhost",
    "port": 6379
}
```

### Usage
The Redis endpoint allows you to cache API responses:

> `localhost:4201/redis/example.com/api/v1/endpoint`

When a request is made to this endpoint:
1. Loki will check if there is a valid cache for this request in Redis
2. If it exists, it will return the data from the cache
3. If it doesn't exist, it will make the request to the actual endpoint, store the response in Redis, and return it

### Advanced Configuration
You can configure custom headers for Redis requests using the `setHeader()` middleware:

```js
router.get("*", setHeader(["CUSTOM_AUTH_HEADER"]), getRedisCache);
```

This is useful when the external endpoint requires authentication or other custom headers.

Cached responses are automatically invalidated after a certain period of time (configurable through Redis).


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Made a V1.0.0
- [ ] Continue writing docs
- [ ] Create classes to change response type
- [x] Enhance handling of errors
- [x] Add additional feature for PUT, POST, PATCH, DELETE methods
- [ ] Improve Redis integration with persistent storage options
- [ ] Add WebSocket advanced features (rooms, events) 

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
<!-- ## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

HASTEGA - [HASTEGA](https://www.hastega.it/) - connect@hastega.it

David Rainò - [CTO](https://www.linkedin.com/in/david-rain%C3%B2-548084a1/) - d.raino@hastega.it

Paolo Micheletti - [MAINTAINER](https://www.linkedin.com/in/pablo1255/) - p.micheletti@hastega.it 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/hastega/Loki?style=for-the-badge
[contributors-url]: https://github.com/hastega/Loki/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/hastega/Loki?style=for-the-badge
[forks-url]: https://ithub.com/hastega/Loki/network/members
[stars-shield]: https://img.shields.io/github/stars/hastega/Loki?style=for-the-badge
[stars-url]: https://github.com/hastega/Loki/stargazers
[issues-shield]: https://img.shields.io/github/issues/hastega/Loki?style=for-the-badge
[issues-url]: https://github.com/hastega/Loki/issues
[license-shield]: https://img.shields.io/github/license/hastega/Loki?style=for-the-badge
[license-url]: https://github.com/hastega/Loki/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/hastega/
[product-screenshot]: images/screenshot.png
[Node.js]: https://img.shields.io/badge/-NodeJS-339933?logo=node.js&logoColor=white&style=for-the-badge
[Node-url]: https://nodejs.org/en/
[Typescript.org]: https://img.shields.io/badge/-Typescript-3178C6?logo=typescript&logoColor=white&style=for-the-badge
[Typescript-url]: https://www.typescriptlang.org/
[Redis]: https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white&style=for-the-badge
[Redis-url]: https://redis.io/ 