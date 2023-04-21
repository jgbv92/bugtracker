import app from "./app";

const main=() =>{
    app.listen(app.get("port"));
    console.log(`Server in port ${(app.get("port"))}`)
};

main();