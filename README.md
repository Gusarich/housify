# Housify

Housify is a programming language and compiler designed for advanced and convenient development in Hypixel Housing.

> **⚠️ WARNING: This repository is currently under active development and is not yet usable. Please check back later for updates.**

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [Changelog](#changelog)
-   [Roadmap](#roadmap)
-   [License](#license)

## Installation

Currently, there is no published package available. To install Housify, you need to clone the repository, build, and link it yourself. Ensure you have NodeJS and a Node Package Manager (such as `npm` or `yarn`) installed. Below is an example of installation using `yarn`:

```bash
git clone https://github.com/Gusarich/housify.git
cd housify
yarn build
yarn link
```

## Usage

Housify modules consist of one or multiple houses. Each house describes its stats and handlers. Below is an example of a simple counter house:

```housify
house Counter {
    global counter: int = 0;

    handle(event: JoinEvent) {
        global.counter = global.counter + 1;
    }
}
```

A house can have multiple handlers for different events.

After writing your Housify module, compile it using the CLI:

```bash
housify my-module.hsf
```

This will compile your module into a JSON file with a formal description of all houses, including used stat names and the list of actions for each handler.

You can then pass that JSON into Housing Writer (in progress) to automatically import all actions into the game without manually writing everything.

## Contributing

We welcome contributions from the community! Please adhere to the following guidelines when contributing:

1. **Open an Issue First:** Before opening a pull request (PR), please open a related issue first. This helps to discuss the changes and get feedback before investing time in development.
2. **Single Issue Focus:** Each issue should address a single, understandable problem. This makes it easier to manage, review, and discuss the changes.

To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request and link it to the related issue.

## Changelog

For a detailed list of changes and updates, refer to the [CHANGELOG](CHANGELOG.md).

## Roadmap

To understand the future direction and planned features of Housify, please see the [ROADMAP](ROADMAP.md).

## License

Housify is licensed under the MIT License. For more details, see the [LICENSE](LICENSE).
