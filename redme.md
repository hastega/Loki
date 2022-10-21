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


<a name="readme-top"></a>



<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://www.hastega.it/">
    <img src="static/images/logo-hastega-bianco-v.png" alt="Temporary Logo">
  </a>

  <h3 align="center">Loki</h3>

  <p align="center">
    An utility Node server to support frontends development
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
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
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

As a software house, during times, working on varius frontends we often get our work stuck by the delay in receaving working backends. So we've built this server: Node Companion is infact a temporary sobstitute of backend logic that permit to not stop the development of frontend. 

We've built it with various utilities that we've used, and still use on a daily base, to serve frontends with the logic needed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][Node-url]
* [![Typescript][Typescript.org]][Typescript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Node.js]: https://img.shields.io/badge/-NodeJS-339933?logo=node.js&logoColor=white&style=for-the-badge
[Node-url]: https://nodejs.org/en/
[Typescript.org]: https://img.shields.io/badge/-Typescript-3178C6?logo=typescript&logoColor=white&style=for-the-badge
[Typescript-url]: https://www.typescriptlang.org/
[Redis]: https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white&style=for-the-badge
[Redis-url]: https://redis.io/