# Housify

Housify is a programming language and a compiler for advanced and convenient development in Hypixel Housing.

## Installation

There is no published package at the moment, so in order to install Housify, you have to clone the repository, build and link it yourself. Note that you need to have installed NodeJS and one of the Node Package Managers (such as `npm` and `yarn`). Below is an example of installation via `yarn`.

```bash
git clone https://github.com/Gusarich/housify.git
cd housify
yarn build
yarn link
```

## Usage

Housify module consists of one or multiple houses. Each house describes its stats and handlers. Below is an example of a simple counter house.

```housify
house Counter {
    global counter: int = 0;

    handle(event: JoinEvent) {
        global.counter = global.counter + 1;
    }
}
```

The house can have multiple handlers for different events.

After you have written the Housify module, you can compile it using CLI:

```bash
housify my-module.hsf
```

It will compile your module into a JSON file with a formal description of all houses, including used stat names and the list of actions for each handler.

You can then pass that JSON into Housing Writer (in progress) to automatically import all actions into the game without manually writing everything.

## Contributing

Pull requests are very welcome. Also, the whole development process is open and being done only through issues and pull requests, even from the side of maintainers.

## License

[MIT](https://choosealicense.com/licenses/mit/)
