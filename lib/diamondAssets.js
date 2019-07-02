let axios = require('axios');
let sha1 = require('js-sha1');

let host = "https://diamond.majorleaguebaseball.com/diamond/2.4.3324/";
let token = false;
let credentials = { user: 'jdefamio', pass: 'T3ddY2517!McW' };

let getAuthChallenge = function()
{
    return new Promise((resolve, reject) => {
        let headers = { headers: { 'X-Diamond-Username': credentials.user}};
        let url = `${host}auth`;
        axios.get(url, headers).then((res) => {
            resolve(res.data);
        })
        .catch((error) =>
        {
            reject(error);
        });
    });
}

let getFinalAuth = function(data)
{
    let hashpass = sha1(data.salt + credentials.pass);
    let auth = sha1(data.challenge + hashpass);
    let finalAuth = data.session_id + "|" + auth;
    let headers = { headers : { 'X-Diamond-Authorization' : finalAuth}};
    let url = `${host}auth`;
    axios.get(url, headers).then((res) => {
        token = res.data.token;
    })
    .catch((error) => {
        console.log("PASSWORD INCORRECT");
    });
}

getAuthChallenge().then((data) => {
    getFinalAuth(data);
}, (error) => {
    console.log("ERROR -> USERNAME NOT FOUND");
});

let diamond = {
    get: (gamepk) => {
        let url = `${host}game/${gamepk}?x=true&associated=true`;
        let headers = { headers: { 'X-Diamond-Authorization': token }};
        return new Promise((resolve, reject) => {
            axios.get(url, headers).then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
};

module.exports = diamond;