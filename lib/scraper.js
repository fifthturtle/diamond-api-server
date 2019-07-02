
var logger = require('./logger.js');  
var Game = require('./Game.js');
var Team = require('./Team.js');

var { asyncForEach }  = require('./asyncForEach.js');
let reality = require("./reality");
        

        

var  scraper = {
    prelim_scrape: async(scrape_date) => {
        let schedule = require("./schedule");
        let Team = require("./Team");

        logger.log({
            level: 'info',
            message: `Scraper starting at: ${new Date()}`
          });
        
        await reality.initPoolConnection();

        this.teams = {};
        let dbTeams = await reality.getTeams();
        await asyncForEach(dbTeams, async (dbTeam) => {
            
            this.teams[dbTeam.bam_team_id] = new Team(dbTeam);
            await this.teams[dbTeam.bam_team_id].storeTeamStats();
            
        });

        return("done");
        
    },
    scrape:  async (scrape_date, forever) => {
        
        
        let schedule = require("./schedule");
        let Game = require("./Game");
        let Team = require("./Team");


        
        
        schedule.get(scrape_date).then( async (sched) => {
            let pGameArray = [];
            let gameArray = [];
            
            
            if(sched && sched.dates && sched.dates.length > 0 )
            {
                await asyncForEach(sched.dates[0].games, async (game) => {
                    let myGame = new Game(game.gamePk, game);
                    await myGame.init();
                    
                    await myGame.processBoxscore( this.teams[game.teams.away.team.id], this.teams[game.teams.home.team.id]);
                    console.log(game.teams.away.team);
                    
                    

                });

                setTimeout( () => { scraper.scrape(scrape_date, forever--);}, 5000);                
                console.log("DONE");

            }
            else
            {
                logger.log({
                    level: 'debug',
                    message: { "error" : "No Games Found" }
                    });
            }




            
            //
        });



        //await reality.closePoolConnection();
        
    }


}

module.exports = scraper;