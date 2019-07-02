

let cmds = {
    test: () => {
        console.log('This is some test output');
    },
    getSchedule:  ()=> {
        let schedule = require("./schedule");
        let date = require("./date");
        let req_date;

        if(!process.argv[3])
            req_date = date.isoToDate(new Date());
        else
            req_date = process.argv[3];
 
        
        schedule.get(req_date).then ((jvSched) =>
            {
                console.log(JSON.stringify(jvSched, null, 2)); 
            }
        );        
    },
    scrape: async () => {
        

        let schedule = require("./schedule");
        let date = require("./date");

        let req_date;

        if(!process.argv[3])
        {
            var today = new Date();
            if(today.getHours() < 9)
                today.setDate(today.getDate() - 1);
            req_date = date.isoToDate(today);
            console.log(req_date);
            
        }
        else
            req_date = process.argv[3];
        
        let scraper = require("./scraper");
        let forever = 20;
        await scraper.prelim_scrape(req_date);
        await scraper.scrape(req_date, forever);
    },
    reality_test: async () => {
        let reality = require("./reality");
        await reality.initPoolConnection();
        await reality.select("select * from games where date_played = '2019-04-17'").then((result, err) => {
            
            console.log(result);

        });
        await reality.closePoolConnection();;


    }

}


module.exports = cmds;