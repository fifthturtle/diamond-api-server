let http = require("http");
let path = require("path");

let host = "statsapi.mlb.com";
let base = "/api";
let euc = encodeURIComponent;

let bamapi = {
    get: (resource, query) => {
        let qs = "";
        if( Object(query) === query ) {
            qs = Object.keys(query).map((k) => {
                return "" + euc(k) + "=" + euc(query[k]);
            }).join("&");
        }
        let rpath = path.posix.join(base, resource) +
                (!!qs ? "?" : "") + qs;
        return new Promise((fulfill, reject) => {
            //let start = new Date().valueOf();
            let req = http.request({
                hostname: host,
                path: rpath,
                method: "GET"
            }, (res) => {
                let body = "";
                res.on("data", (chunk) => { body += chunk; });
                res.on("end", () => {
                    let obj = JSON.parse(body);
                    //console.log(`${resource}: ${new Date().valueOf() - start} ms`);
                    fulfill(obj);
                });
            });
            req.on("error", (err) => {
                reject(err);
            });
            req.end();
        })
        .catch((err) => {
            console.log(err);
        });
    }
};

module.exports = bamapi;
