let bamapi = require("./bamapi");
let reality = require("./reality");

var { asyncForEach, asyncForEachAttribute }  = require('./asyncForEach.js');



function  Team (dbTeam) 
{
    this.dbTeam = dbTeam;



    this.getTeamStats = async (season, type) => {
        // type = hitting, pitching, fielding
        http://statsapi.mlb.com/api/v1/teams/137/stats?group=hitting&stats=season&season=2019
        
        return bamapi.get(`/v1/teams/${this.dbTeam.bam_team_id}/stats?group=${type}&stats=season&season=${season}`, { } )
        .then((obj) => {
            if( !obj  ) {
                return [];
            }
            return(obj);
        });
    }

    this.storeTeamStats = async() => {
        this.stats = {};
        this.stats.batting =  (await this.getTeamStats('2019', 'hitting' )).stats[0].splits[0].stat;
        this.stats.pitching =  (await this.getTeamStats('2019', 'pitching' )).stats[0].splits[0].stat;
        this.stats.fielding =  (await this.getTeamStats('2019', 'fielding' )).stats[0].splits[0].stat;
            //this.teamBattingStats =  await this.getTeamStats('2019', 'hitting' );


    };

    this.updateTeamStats = async() => {

        
        await reality.updateTeamStats(this.dbTeam.id, this.stats);


    };


}

exports = module.exports = Team;
