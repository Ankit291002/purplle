const axios =
require("axios");

async function run() {

    const health =
        await axios.get(
            "http://localhost:3000/health"
        );

    console.log(
        health.data
    );

}

run();