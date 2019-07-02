let bamapi = require("./bamapi");

var schedule = {
    get: (date, args) => {
        if(!args)
            args = {};
        
        return bamapi.get("/v1/schedule", {
            sportId : args.sportId || 1,
            startDate: date,
            endDate: date
        }).then((obj) => {
            if( !obj || !obj.dates || !obj.dates.length ) {
                return [];
            }
            return(obj);
        });
    }
};

module.exports = schedule;