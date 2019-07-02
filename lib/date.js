// the functions will return date and time formats we expect.
// we expect all of them to be EST/EDT, but managing timezones in javascript
// is a dumpster fire (i.e. not possible), so the system timezone must be
// in the correct timezone, or you must run `TZ="America/New_York" node`.

let pad = (num) => {
    let n = num && +num | 0 || 0;
    return (n >= 0 && n < 10 ? "0" : "") + n;
};

let date = {

    isoToDate: (str) => {
        return date.isoToDateTime(str).substr(0,10);
    },

    isoToTime: (str) => {
        return date.isoToDateTime(str).substr(11);
    },

    isoToDateTime: (str) => {
        let d = new Date(str);
        return d.getFullYear() + "-" +
                pad(d.getMonth() + 1) + "-" +
                pad(d.getDate()) + " " +
                pad(d.getHours()) + ":" +
                pad(d.getMinutes()) + ":" +
                pad(d.getSeconds());
    },

    isoToTimecode: (str) => {
        let d = new Date(str);
        let ff = Math.floor(parseInt(str.substr(-4,3), 10) * 30 / 1000);
        let hr = d.getHours();
        let mn = d.getMinutes();
        let sc = d.getSeconds();
        if( sc === 0 && mn % 10 !== 0 ) {
            if( ff === 0 ) {
                if( mn === 0 ) {
                    hr = (hr - 1) % 24;
                }
                mn = (mn - 1) % 60; sc = 59; ff = 29;
            }
            else if( ff === 1 ) {
                ff = 2;
            }
        }
        return pad(hr) + ":" + pad(mn) + ":" + pad(sc) + ";" + pad(ff);
    },
    today: () => {
        return new Date();
    }

};

module.exports = date;
