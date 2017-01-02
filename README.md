## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [Sass](http://sass-lang.com/install) 

sudo apt-get install ruby-full

sudo su -c "gem install sass"


### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

- Run `grunt serve` for debug local with api dev server.
- Run `grunt serve:dev` for preview dev server.
- Run `grunt serve:dist` for for preview staging server.
- Run `grunt build` for building staging server
- Run `grunt build:dev` for building dev server

sudo grunt build:serve