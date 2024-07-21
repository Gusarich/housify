# Housify

Housify is a programming language and compiler specifically designed to enhance and simplify development within Hypixel Housing.

> **⚠️ WARNING: This repository is currently under active development and is not yet usable. Please check back later for updates.**

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [Changelog](#changelog)
-   [Roadmap](#roadmap)
-   [License](#license)

## Installation

Housify is now available as an npm package. To install Housify, ensure you have Node.js and npm installed. Then, you can install Housify using the following command:

```bash
npm install -g housify
```

## Usage

Housify modules consist of one or more houses. Each house describes its stats and event handlers. Below is an example of a simple counter house:

```housify
house Counter {
    global counter: int = 0;

    handle JoinEvent {
        global.counter = global.counter + 1;
    }
}
```

A house can have multiple handlers for different events.

After writing your Housify module, compile it using the CLI:

```bash
housify my-module.hsf
```

This command compiles your module into a JSON file containing a formal description of all houses, including the stat names and a list of actions for each handler.

You can then pass the generated JSON to the Housing Writer (currently in progress) to automatically import all actions into the game without manually writing everything.

## Contributing

We welcome contributions from the community! Please follow these guidelines when contributing:

1. **Open an Issue First:** Before submitting a pull request (PR), please open a related issue to discuss the changes and receive feedback.
2. **Single Issue Focus:** Each issue should address a single, understandable problem, making it easier to manage, review, and discuss changes.

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
