@guide: Setting up a development environment
category: 4. Annexes
authors:
  - "@robotlolita"
---

A step-by-step guide to set up a development environment for working on Folktale.

* * *

Configuring a development environment for Folktale is currently a little bit
more complicated than it should in some systems, but this guide should help
you achieve that anyway.


## Git

First of all, you'll have to make sure you have [Git](https://git-scm.com/)
installed. Folktale uses Git repositories, and while while you can use things
like [hg-git](http://hg-git.github.io/) to interact with the repository from
Mercurial, we can't support that.

The Git website has a list of GUI clients for Git, if you're not comfortable
using it from the command line.

## Node

Next you'll need to install [Node.js](https://nodejs.org/en/). The website
provides binaries for all supported platforms. All newer versions of Node come
with npm as well, which you'll use to pull the dependencies of the project.

Note that Folktale requires at least Node 4.x, so if you have an older version
you'll need to upgrade.

## Make

Folktale uses Make as its build system, and also relies on some common *NIX
tools, like `find`. Because of this, it might be harder to configure a
development environment for Windows.

Below are instructions to install Make on common systems:

> **TODO**  
> Provide instructions for OS/X and *BSD systems.

### Debian/Ubuntu (Linux):

    $ apt-get install build-essential

### Arch (Linux):

    $ pacman -S base-devel

### Fedora / Enterprise Linux:

    $ yum install "Development Tools"

### Windows:

 1. Download the latest version of [GnuWin32](https://sourceforge.net/projects/getgnuwin32/files/). This should be something like `GetGnuWin32-*.exe`;
 2. Execute the application you just downloaded. You have to accept the licence to proceed;
 3. Select a folder to extract the components to;
 4. Run `download.bat` from the folder you extracted the components to;
 5. Finally, run `install.bat` from that folder.


## Cloning and initialising the repository

The first thing you'll want to do is
[forking Folktale](https://guides.github.com/activities/forking/). This means
you get a clone of the entire project that you have rights to change as you
wish. Once you have forked Folktale, you can clone your fork:

```shell
$ git clone https://github.com/YOUR_GITHUB_USERNAME/folktale.git
```

This will create a `folktale` folder containing all of the code in the
project. The first thing you need to do is move in that folder and install all
of the dependencies and development tools that Folktale uses:

```shell
$ cd folktale
$ npm install
# Some of the tools are in a git subrepo
$ git submodule init
$ git submodule update
$ make tools
```
