### Linkek

- [Discord](https://discord.com/channels/823104905141157918/1141629090735067176)
- [Postnam API](https://documenter.getpostman.com/view/795261/2s9Xy6pUdQ)
- [Repository](https://github.com/FiddlerZsolt/node-tir-api)
- [Board](https://github.com/users/FiddlerZsolt/projects/1)

---

### Stack

- [Moleculer](https://moleculer.services/)
- [Fastest-validator](https://github.com/icebob/fastest-validator)
- [Mongoose](https://mongoosejs.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [hat](https://www.npmjs.com/package/hat)

---

- [Atlas compass](https://www.mongodb.com/products/compass)

---

### TIR-Engine

Checkout the following repository next to the project: [TIR-ENGINE-GRPC](https://github.com/Ptrskay3/tir-engine-grpc)
Follow the instructions in the README.md

Create an `.env.grpc.development` file by `.env.grpc.development.example` example and place the OPENAI_SK value.

Clone tir-engine-grpc repo to th root folder:

```bash
    git clone https://github.com/Ptrskay3/tir-engine-grpc.git
```

```bash
    git submodule init
    git submodule sync
    git submodule update --remote --recursive --no-single-branch
```

```bash
    cd tir-engine-grpc
```

```bash
    git clone https://github.com/teamcodeyard/tir-engine.git
```

Start the project with Docker Compose:

```bash
    npm run dc:up
```
