let bamapi = require("./bamapi");
let reality = require("./reality");

var { asyncForEach, asyncForEachAttribute }  = require('./asyncForEach.js');



function  Game (game_pk, data) 
{
    this.game_pk = game_pk;
    this.game_id;
    this.data = data;
    this.player_id_map = {};
    this.game_state = "";
    this.homeTeamId = -1;
    this.awayTeamId = -1;

    this.init  = async () => {

        this.game_id = await  reality.getGameIdByBamId(this.game_pk);


        //console.log(`Game ID: ${this.game_id}`);
        this.awayTeamId = await reality.getTeamIdByBamId(data.teams.away.team.id);

        //console.log(`Game Status: ${this.data.status.statusCode}`);


        
        //console.log(`Away Team ID: ${this.awayTeamId}`);
        this.homeTeamId = await reality.getTeamIdByBamId(data.teams.home.team.id);
        //console.log(`Home Team ID: ${this.homeTeamId}`);

        this.awayGamesHasTeamId = await reality.confirmGameHasTeams(this.game_id, this.awayTeamId);
        //console.log(`Games Has Away Team ID: ${this.awayGamesHasTeamId}`);
        this.homeGamesHasTeamId = await reality.confirmGameHasTeams(this.game_id, this.homeTeamId);
        //console.log(`Games Has Home Team ID: ${this.homeGamesHasTeamId}`);

        if(this.data.status.statusCode == "P" ||this.data.status.statusCode == "S" )
        {
            
            await reality.snapHomeAtBatCount(this.game_id, this.homeTeamId);
            this.home_team_atbat_count = -1;
        }
        else
        {
            
            this.home_team_atbat_count = await reality.getHomeAtBatCount(this.game_id, this.homeTeamId);
            


        }


        if(this.already_initalized == true)
            return(true);
        
        this.already_initalized = true;  

        
        


    };

    this.getBoxscore = () => {
        return bamapi.get(`/v1/game/${this.game_pk}/boxscore`, { } )
        .then((obj) => {
            if( !obj  ) {
                return [];
            }
            return(obj);
        });
        

    };


    this.processBoxscore = async (away_team_season, home_team_season) => {
            var boxscore = await this.getBoxscore();
            
            await asyncForEachAttribute(boxscore.teams.away.players, async (player) => {
                
                await this.saveGameStats(boxscore.teams.away.team,player); 
            });
            
            await asyncForEachAttribute(boxscore.teams.home.players, async (player) => {
                await this.saveGameStats(boxscore.teams.home.team, player); 
            });
            
           //makes it easier to know if it's home or away
           boxscore.teams.away.boxscoreType  = "away";
           boxscore.teams.home.boxscoreType  = "home";
            //console.log(`${this.home_team_atbat_count} != ${ home_team_season.stats.batting.atBats}`);
            
            await this.processTeamStats(
                this.home_team_atbat_count == home_team_season.stats.batting.atBats , 
                this.awayTeamId,
                this.awayGamesHasTeamId, 
                boxscore.teams.away.teamStats, 
                away_team_season.stats
            );
            await this.processTeamStats(
                this.home_team_atbat_count == home_team_season.stats.batting.atBats , 
                this.homeTeamId,
                this.homeGamesHasTeamId, 
                boxscore.teams.home.teamStats, 
                home_team_season.stats
            );


    };


    this.getLinescore = () => {
        return bamapi.get(`/v1/game/${this.game_pk}/linescore`, { } )
        .then((obj) => {
            if( !obj  ) {
                return [];
            }
            return(obj);
        });
        

    };

    
    
    this.saveGameStats = async ( team , player) => {
        
        
       
            if(player.stats.batting.gamesPlayed || player.stats.pitching.gamesPlayed)
            {
                //console.log(player.stats.batting);
                if(!this.player_id_map.hasOwnProperty(player.person.id))
                    this.player_id_map[player.person.id] = await reality.getPlayerIdByBamId(player.person.id);
               
               // console.log(` ${team.abbreviation } - ${player.person.fullName} - ${this.player_id_map[player.person.id]}`);
                

                
                await reality.updateGamesHasPlayers(
                    this.game_id,
                    this.player_id_map[player.person.id],
                    player
                );

                await reality.updatePlayerSeasonStats(
                    this.player_id_map[player.person.id],
                    player.seasonStats
                );
                
            }

    };


    
    this.processTeamStats = async(add_mode, teamId, gameHasTeamsId, teamBoxscore, seasonStats) => {
        
        //console.log(teamBoxscore.teamStats);
        //console.log(season_stats);
        console.log(`add_mode ${add_mode}`);
        if(add_mode)
        {
            
            await reality.addBoxscoreToTeamStats(
                teamId,
                seasonStats,
                teamBoxscore
                
            );
        }
        else
        {
           await  reality.updateTeamStats(
            teamId,
            seasonStats
           );
        }

        await reality.updateGamesHasTeams(
            gameHasTeamsId,
            teamBoxscore
        );

    }


}

exports = module.exports = Game;