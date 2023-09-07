### Linkek

-   [Discord](https://discord.com/channels/823104905141157918/1141629090735067176)
-   [Postnam API](https://documenter.getpostman.com/view/795261/2s9Xy6pUdQ)
-   [Repository](https://github.com/FiddlerZsolt/node-tir-api)
-   [Board](https://github.com/users/FiddlerZsolt/projects/1)

---

### Stack

-   [Moleculer](https://moleculer.services/)
-   [Fastest-validator](https://github.com/icebob/fastest-validator)
-   [Mongoose](https://mongoosejs.com/)
-   [bcrypt](https://www.npmjs.com/package/bcrypt)
-   [hat](https://www.npmjs.com/package/hat)

---

-   [Atlas compass](https://www.mongodb.com/products/compass)

---

### TIR-Engine

Create a Dockerfile in the "tir-engine-grpc" folder and paste the following code:

```Dockerfile
FROM rust:1.72 AS builder

WORKDIR /tir-engine

COPY . .

RUN apt-get update

RUN apt-get install -y protobuf-compiler libprotobuf-dev

RUN cargo install --path .
RUN cargo build

FROM builder

CMD [ "cargo", "r" ]
```

The gRPC server is using IPV6 by default, but the IPV6 thing in Docker is torture, go to "tir-engine-grpc/src/main.rs" and modify line 141 to this:

```rust
    let addr = "0.0.0.0:50051".parse()?;
```
