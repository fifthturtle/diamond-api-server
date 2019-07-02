const sql = require('mssql');
var xlat = require("./jsonToDbXlate.js");

const reality_config = {
    user: 'MLBP_svc',
    password: 'mlbp01',
    server: 'sqlvs02b', // You can use 'localhost\\instance' to connect to named instance
    database: 'Reality',

    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
};


const dev_reality_config = {
    user: 'MLBP_svc',
    password: 'mlbp0101',
    server: 'mlbn-vsqldev', // You can use 'localhost\\instance' to connect to named instance
    database: 'Reality',

    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
};

var  reality  = { 
    initPoolConnection : async () => {


        this.pool1 = new sql.ConnectionPool(dev_reality_config);

        await this.pool1.connect();
        
        this.pool1.on('error', err => {
            console.log(err);
        })

    },
    closePoolConnection : () => {
        this.pool1.close();
    },

    select: async (sql) => {
        await this.pool1;

        try {
            const request = this.pool1.request(); // or: new sql.Request(pool1)
            return request.query(sql);

            
            
        } 
        catch (err) {
            console.error('SQL error', err);
        }

    },
    updateGamesHasPlayers : async (game_id, player_id, player) => {
        //console.log(`${game_id} - ${player_id}`);

      

        try
        {
            if(player.stats.batting.gamesPlayed)
            {
        
                let resultBatting = await this.pool1.request()
                    .input('g', sql.Int, player.stats.batting.gamesPlayed)
                    .input('ab', sql.Int, player.stats.batting.atBats)
                    .input('r', sql.Int, player.stats.batting.runs)
                    .input('h', sql.Int, player.stats.batting.hits)

                    .input('bb', sql.Int, player.stats.batting.baseOnBalls)
                    .input('doubles', sql.Int, player.stats.batting.doubles)
                    .input('triples', sql.Int, player.stats.batting.triples)
                    .input('hr', sql.Int, player.stats.batting.homeRuns)
                    .input('hbp', sql.Int, player.stats.batting.hitByPitch)
                    .input('rbi', sql.Int, player.stats.batting.rbi)
                    .input('tb', sql.Int, player.stats.batting.totalBases)
                    .input('so', sql.Int, player.stats.batting.strikeOuts)
                    .input('sb', sql.Int, player.stats.batting.stolenBases)
                    .input('cs', sql.Int, player.stats.batting.caughtStealing)
                    .input('sac', sql.Int, player.stats.batting.sacBunts)
                    .input('sf', sql.Int, player.stats.batting.sacFlies)
                    .input('e', sql.Int, player.stats.fielding.errors)
                    .input('putouts', sql.Int, player.stats.fielding.putOuts)
                    .input('assists', sql.Int, player.stats.fielding.assists)
                    .input('game_id', sql.Int, game_id)
                    .input('player_id', sql.Int, player_id)
                    .input('batting_order', sql.Int, player.battingOrder)
                    .query('update games_has_players set ' +
                    'g = @g, ab = @ab, r = @r, h = @h, doubles = @doubles, triples = @triples, bb = @bb, ' + 
                    'hr = @hr, @hbp = @hbp, rbi = @rbi, tb = @tb, so = @so, sb = @sb, cs = @cs, ' +
                    'sac = @sac, sf = @sf , putouts = @putouts, assists = @assists, ' +
                    'batting_order = @batting_order ' + 
                    'where fk_games_id = @game_id and fk_players_id = @player_id');

            }
            else
            {
                console.log("                  Pitcher most likely.. skipping");
            }
        }
        catch (err) {
            console.error('SQL error: ', err);
            process.exit(0);
        }     
        try
        {
            if(player.stats.pitching.gamesPlayed)
            {
                
                

                let resultPitching = await this.pool1.request()                
                    .input('p_g', sql.Int, player.stats.pitching.gamesPlayed)
                    .input('p_pitches', sql.Int, player.stats.pitching.pitchesThrown)
                    .input('p_strikes', sql.Int, player.stats.pitching.strikes)
                    .input('p_balls', sql.Int, player.stats.pitching.balls)
                    .input('p_bb', sql.Int, player.stats.pitching.baseOnBalls)
                    .input('p_so', sql.Int, player.stats.pitching.strikeOuts)
                    .input('p_wild_pitch', sql.Int, player.stats.pitching.wildPitches)
                    .input('p_outs', sql.Int, player.stats.pitching.outs)
                    .input('p_innings', sql.NVarChar, player.stats.pitching.inningsPitched)
                    .input('p_earned_runs', sql.Int, player.stats.pitching.earnedRuns)
                    .input('p_runs_allowed', sql.Int, player.stats.pitching.runs)
                    .input('p_hits_allowed', sql.Int, player.stats.pitching.hits)
                    .input('p_home_runs_allowed', sql.Int, player.stats.pitching.homeRuns)
                    .input('p_stolen_bases_allowed', sql.Int, player.stats.pitching.stolenBases)
                    .input('p_hit_batsmen', sql.Int, player.stats.pitching.hitBatsmen)
                    .input('catchers_int', sql.Int, player.stats.pitching.catchersInterference)
                    .input('game_id', sql.Int, game_id)
                    .input('player_id', sql.Int, player_id)
                    

                    .query('update games_has_players set ' +
                    'p_g = @p_g , p_pitches = @p_pitches, p_strikes = @p_strikes, p_balls = @p_balls, p_bb = @p_bb, ' + 
                    'p_so = @p_so, p_wild_pitch = @p_wild_pitch, p_outs = @p_outs, p_innings = @p_innings, ' +
                    'p_earned_runs = @p_earned_runs, p_runs_allowed = @p_runs_allowed, p_hits_allowed = @p_hits_allowed, ' +
                    'p_home_runs_allowed = @p_home_runs_allowed, p_stolen_bases_allowed = @p_stolen_bases_allowed, ' +
                    'p_hit_batsmen = @p_hit_batsmen, catchers_int = @catchers_int '  +
                    'where fk_games_id = @game_id and fk_players_id = @player_id');

                    
            }
        }
        catch (err) {
            console.error('SQL error: ', err);
            process.exit(0);
        }     
  

    },
    updatePlayerSeasonStats : async ( player_id, seasonStats) => {
        
    
        
        try
        {

        
            let resultBatting = await this.pool1.request()
                .input('g', sql.Int, seasonStats.batting.gamesPlayed)
                .input('ab', sql.Int, seasonStats.batting.atBats)
                .input('r', sql.Int, seasonStats.batting.runs)
                .input('h', sql.Int, seasonStats.batting.hits)

                .input('bb', sql.Int, seasonStats.batting.baseOnBalls)
                .input('doubles', sql.Int, seasonStats.batting.doubles)
                .input('triples', sql.Int, seasonStats.batting.triples)
                .input('hr', sql.Int, seasonStats.batting.homeRuns)
                .input('hbp', sql.Int, seasonStats.batting.hitByPitch)
                .input('rbi', sql.Int, seasonStats.batting.rbi)
                .input('tb', sql.Int, seasonStats.batting.totalBases)
                .input('so', sql.Int, seasonStats.batting.strikeOuts)
                .input('sb', sql.Int, seasonStats.batting.stolenBases)
                .input('cs', sql.Int, seasonStats.batting.caughtStealing)
                .input('sac', sql.Int, seasonStats.batting.sacBunts)
                .input('sf', sql.Int, seasonStats.batting.sacFlies)
                .input('e', sql.Int, seasonStats.fielding.errors)
                .input('putouts', sql.Int, seasonStats.fielding.putOuts)
                .input('assists', sql.Int, seasonStats.fielding.assists)
                .input('player_id', sql.Int, player_id)
                
                .query("update player_season_splits  set " +
                "g = @g, ab = @ab, r = @r, h = @h, doubles = @doubles, triples = @triples, bb = @bb, " + 
                "hr = @hr, @hbp = @hbp, rbi = @rbi, tb = @tb, so = @so, sb = @sb, cs = @cs, " +
                "sac = @sac, sf = @sf , putouts = @putouts, assists = @assists " +
                "where fk_players_id = @player_id and split_name='totals' ");


            if(seasonStats.pitching.gamesPlayed)
            {
                let resultPitching = await this.pool1.request()                
                    .input('p_g', sql.Int, seasonStats.pitching.gamesPlayed)
                    .input('p_pitches', sql.Int, seasonStats.pitching.pitchesThrown)
                    .input('p_strikes', sql.Int, seasonStats.pitching.strikes)
                    .input('p_balls', sql.Int, seasonStats.pitching.balls)
                    .input('p_bb', sql.Int, seasonStats.pitching.baseOnBalls)
                    .input('p_so', sql.Int, seasonStats.pitching.strikeOuts)
                    .input('p_wild_pitch', sql.Int, seasonStats.pitching.wildPitches)
                    .input('p_outs', sql.Int, seasonStats.pitching.Outs)
                    .input('p_innings', sql.NVarChar, seasonStats.pitching.inningsPitched)
                    .input('p_earned_runs', sql.Int, seasonStats.pitching.earnedRuns)
                    .input('p_runs_allowed', sql.Int, seasonStats.pitching.runs)
                    .input('p_hits_allowed', sql.Int, seasonStats.pitching.hits)
                    .input('p_home_runs_allowed', sql.Int, seasonStats.pitching.homeRuns)
                    .input('p_stolen_bases_allowed', sql.Int, seasonStats.pitching.stolenBases)
                    .input('p_hit_batsmen', sql.Int, seasonStats.pitching.hitBatsmen)
                    .input('catchers_int', sql.Int, seasonStats.pitching.catchersInterference)
                    .input('p_wins', sql.Int, seasonStats.pitching.wins)
                    .input('p_losses', sql.Int, seasonStats.pitching.losses)
                    .input('p_saves', sql.Int, seasonStats.pitching.saves)
                    .input('player_id', sql.Int, player_id)
                    

                    .query("update player_season_splits set " +
                    "p_g = @p_g , p_pitches = @p_pitches, p_strikes = @p_strikes, p_balls = @p_balls, p_bb = @p_bb, " + 
                    "p_so = @p_so, p_wild_pitch = @p_wild_pitch, p_outs = @p_outs, p_innings = @p_innings, " +
                    "p_earned_runs = @p_earned_runs, p_runs_allowed = @p_runs_allowed, p_hits_allowed = @p_hits_allowed, " +
                    "p_home_runs_allowed = @p_home_runs_allowed, p_stolen_bases_allowed = @p_stolen_bases_allowed, " +
                    "p_hit_batsmen = @p_hit_batsmen, catchers_int = @catchers_int, "  +
                    "p_wins = @p_wins , p_losses = @p_losses, p_saves = @p_saves " +
                    "where  fk_players_id = @player_id and split_name='totals'");

                    
            }
        }
        catch (err) {
            console.error('SQL error: ', err);
            process.exit(0);
        }     
  

    },
    getGameIdByBamId: async (bam_game_pk) => {

        let result = await this.pool1.request()
            .input('game_pk', sql.Int, bam_game_pk)
            .query('select id from games where game_pk = @game_pk');
                  
        return(result.recordset.length > 0 ? result.recordset[0].id : -1);

    },
    getTeamIdByBamId: async (bam_team_id) => {

        let result = await this.pool1.request()
            .input('bam_team_id', sql.Int, bam_team_id)
            .query('select id from teams where bam_team_id = @bam_team_id');
                  
        return(result.recordset.length > 0 ? result.recordset[0].id : -1);

    },
    gameStarted: async (game_id) => {

    },
    getPlayerIdByBamId: async (bam_player_id) => {
        /*
            for(var propertyName in xlat.gameHasPlayersBatting) {
                    console.log(` ${propertyName} == ${xlat.gameHasPlayersBatting[propertyName]} ==  ${seasonStats.batting[xlat.gameHasPlayersBatting[propertyName]]}`);
                   
                  }

        */

        let result = await this.pool1.request()
            .input('mlb_com_id', sql.Int, bam_player_id)
            .query('select id from players where mlb_com_id = @mlb_com_id');
                  
        return(result.recordset.length > 0 ? result.recordset[0].id : -1);

    },
    confirmGameHasTeams: async (game_id, team_id) => {
        let result = await this.pool1.request()
            .input('team_id', sql.Int, team_id)
            .input('game_id', sql.Int, game_id)
            .query('select id from games_has_teams where fk_games_id = @game_id and fk_teams_id = @team_id');
     
        let gamesHasTeamsId = -1;
        if(result.recordset.length == 0)
        {
            let result2 = await this.pool1.request()
            .input('team_id', sql.Int, team_id)
            .input('game_id', sql.Int, game_id)
            .query('insert into games_has_teams (fk_games_id, fk_teams_id) values(@game_id, @team_id); SELECT SCOPE_IDENTITY() AS id;' );

            if(result2.recordset.length > 0)
                gamesHasTeamsId = result2.recordset[0].id;
            else
                console.log('NO RECRODSET');
        }
        else
        {
            gamesHasTeamsId = result.recordset[0].id;
        }

        return(gamesHasTeamsId);
        
    },
    updateGamesHasTeams: async (gamesHasTeamsId, teamBoxScore) => {
        try
        {
        
            let resultBatting = await this.pool1.request()
                
                .input('ab', sql.Int, teamBoxScore.batting.atBats)
                .input('r', sql.Int, teamBoxScore.batting.runs)
                .input('h', sql.Int, teamBoxScore.batting.hits)

                .input('bb', sql.Int, teamBoxScore.batting.baseOnBalls)
                .input('doubles', sql.Int, teamBoxScore.batting.doubles)
                .input('triples', sql.Int, teamBoxScore.batting.triples)
                .input('hr', sql.Int, teamBoxScore.batting.homeRuns)
                .input('hbp', sql.Int, teamBoxScore.batting.hitByPitch)
                .input('rbi', sql.Int, teamBoxScore.batting.rbi)
                .input('tb', sql.Int, teamBoxScore.batting.totalBases)
                .input('so', sql.Int, teamBoxScore.batting.strikeOuts)
                .input('sb', sql.Int, teamBoxScore.batting.stolenBases)
                .input('cs', sql.Int, teamBoxScore.batting.caughtStealing)
                .input('sac', sql.Int, teamBoxScore.batting.sacBunts)
                .input('sf', sql.Int, teamBoxScore.batting.sacFlies)
                .input('e', sql.Int, teamBoxScore.fielding.errors)
                .input('putouts', sql.Int, teamBoxScore.fielding.putOuts)
                .input('assists', sql.Int, teamBoxScore.fielding.assists)
                .input('id', sql.Int, gamesHasTeamsId)
                
                .query("update games_has_teams  set " +
                " ab = @ab, r = @r, h = @h, doubles = @doubles, triples = @triples, bb = @bb, " + 
                "hr = @hr, @hbp = @hbp, rbi = @rbi, tb = @tb, so = @so, sb = @sb, cs = @cs, " +
                "sac = @sac, sf = @sf , putouts = @putouts, assists = @assists " +
                "where id= @id ");


            if(teamBoxScore.pitching)
            {
                let resultPitching = await this.pool1.request()                
                    .input('p_pitches', sql.Int, teamBoxScore.pitching.pitchesThrown)
                    .input('p_strikes', sql.Int, teamBoxScore.pitching.strikes)
                    .input('p_balls', sql.Int, teamBoxScore.pitching.balls)
                    .input('p_bb', sql.Int, teamBoxScore.pitching.baseOnBalls)
                    .input('p_so', sql.Int, teamBoxScore.pitching.strikeOuts)
                    .input('p_wild_pitch', sql.Int, teamBoxScore.pitching.wildPitches)
                    .input('p_outs', sql.Int, teamBoxScore.pitching.Outs)
                    .input('p_innings', sql.NVarChar, teamBoxScore.pitching.inningsPitched)
                    .input('p_earned_runs', sql.Int, teamBoxScore.pitching.earnedRuns)
                    .input('p_runs_allowed', sql.Int, teamBoxScore.pitching.runs)
                    .input('p_hits_allowed', sql.Int, teamBoxScore.pitching.hits)
                    .input('p_home_runs_allowed', sql.Int, teamBoxScore.pitching.homeRuns)
                    .input('p_stolen_bases_allowed', sql.Int, teamBoxScore.pitching.stolenBases)
                    .input('p_hit_batsmen', sql.Int, teamBoxScore.pitching.hitBatsmen)
                    .input('catchers_int', sql.Int, teamBoxScore.pitching.catchersInterference)
                    .input('id', sql.Int, gamesHasTeamsId)
                    

                    .query("update games_has_teams set " +
                    " p_pitches = @p_pitches, p_strikes = @p_strikes, p_balls = @p_balls, p_bb = @p_bb, " + 
                    "p_so = @p_so, p_wild_pitch = @p_wild_pitch, p_outs = @p_outs, p_innings = @p_innings, " +
                    "p_earned_runs = @p_earned_runs, p_runs_allowed = @p_runs_allowed, p_hits_allowed = @p_hits_allowed, " +
                    "p_home_runs_allowed = @p_home_runs_allowed, p_stolen_bases_allowed = @p_stolen_bases_allowed, " +
                    "p_hit_batsmen = @p_hit_batsmen, catchers_int = @catchers_int "  +
                    "where id= @id ");

                    
            }
        }
        catch (err) {
            console.error('SQL error: ', err);
            process.exit(0);
        }     
  

    },
    getTeams: async () =>
    {
        let result = await this.pool1.request()
        .query("select * from  teams where league_code in ('NL', 'AL')");
              
         return(result.recordset);

    },
    updateTeamStats: async (team_id, stats) => 
    {
        console.log(`team_id: ${team_id}   ab: ${stats.batting.atBats}`);
        try
        {
        
            let resultBatting = await this.pool1.request()
                
                .input('ab', sql.Int, stats.batting.atBats)
                .input('r', sql.Int, stats.batting.runs)
                .input('h', sql.Int, stats.batting.hits)
                .input('bb', sql.Int, stats.batting.baseOnBalls)
                .input('doubles', sql.Int, stats.batting.doubles)
                .input('triples', sql.Int, stats.batting.triples)
                .input('hr', sql.Int, stats.batting.homeRuns)
                .input('hbp', sql.Int, stats.batting.hitByPitch)
                .input('rbi', sql.Int, stats.batting.rbi)
                .input('tb', sql.Int, stats.batting.totalBases)
                .input('so', sql.Int, stats.batting.strikeOuts)
                .input('sb', sql.Int, stats.batting.stolenBases)
                .input('cs', sql.Int, stats.batting.caughtStealing)
                .input('sac', sql.Int, stats.batting.sacBunts)
                .input('sf', sql.Int, stats.batting.sacFlies)
                .input('e', sql.Int, stats.fielding.errors)
                .input('putouts', sql.Int, stats.fielding.putOuts)
                .input('assists', sql.Int, stats.fielding.assists)
                .input('p_pitches', sql.Int, stats.pitching.pitchesThrown)
                .input('p_strikes', sql.Int, stats.pitching.strikes)
                .input('p_balls', sql.Int, stats.pitching.balls)
                .input('p_bb', sql.Int, stats.pitching.baseOnBalls)
                .input('p_so', sql.Int, stats.pitching.strikeOuts)
                .input('p_wild_pitch', sql.Int, stats.pitching.wildPitches)
                .input('p_outs', sql.Int, stats.pitching.Outs)
                .input('p_innings', sql.NVarChar, stats.pitching.inningsPitched)
                .input('p_earned_runs', sql.Int, stats.pitching.earnedRuns)
                .input('p_runs_allowed', sql.Int, stats.pitching.runs)
                .input('p_hits_allowed', sql.Int, stats.pitching.hits)
                .input('p_home_runs_allowed', sql.Int, stats.pitching.homeRuns)
                .input('p_stolen_bases_allowed', sql.Int, stats.pitching.stolenBases)
                .input('p_hit_batsmen', sql.Int, stats.pitching.hitBatsmen)
                .input('catchers_int', sql.Int, stats.pitching.catchersInterference)
                .input('id', sql.Int, team_id)
                
                
                .query("update team_season_splits  set " +
                " ab = @ab, r = @r, h = @h, doubles = @doubles, triples = @triples, bb = @bb, " + 
                "hr = @hr, hbp = @hbp, rbi = @rbi, tb = @tb, so = @so, sb = @sb, cs = @cs, " +
                "sac = @sac, sf = @sf , putouts = @putouts, assists = @assists,  " +
                " p_pitches = @p_pitches, p_strikes = @p_strikes, p_balls = @p_balls, p_bb = @p_bb, " + 
                "p_so = @p_so, p_wild_pitch = @p_wild_pitch, p_outs = @p_outs, p_innings = @p_innings, " +
                "p_earned_runs = @p_earned_runs, p_runs_allowed = @p_runs_allowed, p_hits_allowed = @p_hits_allowed, " +
                "p_home_runs_allowed = @p_home_runs_allowed, p_stolen_bases_allowed = @p_stolen_bases_allowed, " +
                "p_hit_batsmen = @p_hit_batsmen, catchers_int = @catchers_int "  +
                "where fk_teams_id = @id and split_name = 'totals'");


        }
        catch (err) {
            console.error('SQL error: ', err);
            process.exit(0);
        }     


    },
    addBoxscoreToTeamStats: async (team_id, stats, box_stats) => 
    {
        
        //console.log(box_stats);
        console.log(`team_id: ${team_id}   ab: ${stats.batting.atBats} box_ab: ${box_stats.batting.atBats}`);
        
        //console.log(box_stats);
        

        try
        {
        
            let resultBatting = await this.pool1.request()
                
                .input('ab', sql.Int,   stats.batting.atBats + box_stats.batting.atBats )
                .input('r', sql.Int, stats.batting.runs + box_stats.batting.runs )
                .input('h', sql.Int, stats.batting.hits + box_stats.batting.hits )
                .input('bb', sql.Int, stats.batting.baseOnBalls + box_stats.batting.baseOnBalls )
                .input('doubles', sql.Int, stats.batting.doubles + box_stats.batting.doubles )
                .input('triples', sql.Int, stats.batting.triples + box_stats.batting.triples )
                .input('hr', sql.Int, stats.batting.homeRuns + box_stats.batting.homeRuns )
                .input('hbp', sql.Int, stats.batting.hitByPitch + box_stats.batting.hitByPitch )
                .input('rbi', sql.Int, stats.batting.rbi + box_stats.batting.rbi )
                .input('tb', sql.Int, stats.batting.totalBases + box_stats.batting.totalBases )
                .input('so', sql.Int, stats.batting.strikeOuts + box_stats.batting.strikeOuts )
                .input('sb', sql.Int, stats.batting.stolenBases + box_stats.batting.stolenBases )
                .input('cs', sql.Int, stats.batting.caughtStealing + box_stats.batting.caughtStealing )
                .input('sac', sql.Int, stats.batting.sacBunts + box_stats.batting.sacBunts )
                .input('sf', sql.Int, stats.batting.sacFlies + box_stats.batting.sacFlies )
                .input('e', sql.Int, stats.fielding.errors + box_stats.fielding.errors )
                .input('putouts', sql.Int, stats.fielding.putOuts + box_stats.fielding.putOuts )
                .input('assists', sql.Int, stats.fielding.assists + box_stats.fielding.assists )
                .input('p_pitches', sql.Int, stats.pitching.pitchesThrown + box_stats.pitching.pitchesThrown )
                .input('p_strikes', sql.Int, stats.pitching.strikes + box_stats.pitching.strikes )
                .input('p_balls', sql.Int, stats.pitching.balls + box_stats.pitching.balls )
                .input('p_bb', sql.Int, stats.pitching.baseOnBalls + box_stats.pitching.baseOnBalls )
                .input('p_so', sql.Int, stats.pitching.strikeOuts + box_stats.pitching.strikeOuts )
                .input('p_wild_pitch', sql.Int, stats.pitching.wildPitches + box_stats.pitching.wildPitches )
                .input('p_outs', sql.Int, stats.pitching.Outs + box_stats.pitching.Outs )
                .input('p_earned_runs', sql.Int, stats.pitching.earnedRuns + box_stats.pitching.earnedRuns )
                .input('p_runs_allowed', sql.Int, stats.pitching.runs + box_stats.pitching.runs )
                .input('p_hits_allowed', sql.Int, stats.pitching.hits + box_stats.pitching.hits  )
                .input('p_home_runs_allowed', sql.Int, stats.pitching.homeRuns + box_stats.pitching.homeRuns )
                .input('p_stolen_bases_allowed', sql.Int, stats.pitching.stolenBases + box_stats.pitching.stolenBases )
                .input('p_hit_batsmen', sql.Int, stats.pitching.hitBatsmen + box_stats.pitching.hitBatsmen )
                .input('catchers_int', sql.Int, stats.pitching.catchersInterference + box_stats.pitching.catchersInterference )
                .input('id', sql.Int, team_id)
                
                
                .query("update team_season_splits  set " +
                " ab = @ab, r = @r, h = @h, doubles = @doubles, triples = @triples, bb = @bb, " + 
                "hr = @hr, hbp = @hbp, rbi = @rbi, tb = @tb, so = @so, sb = @sb, cs = @cs, " +
                "sac = @sac, sf = @sf , putouts = @putouts, assists = @assists,  " +
                " p_pitches = @p_pitches, p_strikes = @p_strikes, p_balls = @p_balls, p_bb = @p_bb, " + 
                "p_so = @p_so, p_wild_pitch = @p_wild_pitch, p_outs = @p_outs, " +
                "p_earned_runs = @p_earned_runs, p_runs_allowed = @p_runs_allowed, p_hits_allowed = @p_hits_allowed, " +
                "p_home_runs_allowed = @p_home_runs_allowed, p_stolen_bases_allowed = @p_stolen_bases_allowed, " +
                "p_hit_batsmen = @p_hit_batsmen, catchers_int = @catchers_int "  +
                "where fk_teams_id = @id and split_name = 'totals'");

                //.input('p_innings', sql.NVarChar, stats.pitching.inningsPitched + box_stats.pitching.inningsPitched )


        }
        catch (err) {
            console.error('SQL error: ', err);
            process.exit(0);
        }     


    },
    snapHomeAtBatCount: async (game_id, team_id) => {
        //console.log(`Game ID: ${game_id}   Team ID: ${team_id}`);
        
        
        let result = await this.pool1.request()
            .input('team_id', sql.Int, team_id)
            .input('game_id', sql.Int, game_id)
            .query("update games set at_bats_start = (select ab from team_season_splits where split_name = 'totals' " + 
            " and fk_teams_id = @team_id) where id = @game_id;");
     
        return("Done");
        
    },
    getHomeAtBatCount: async (game_id)  =>
    {
        let result = await this.pool1.request()
            .input('game_id', sql.Int, game_id)
            .query("select at_bats_start from  games where id = @game_id");
                
         return(result.recordset[0].at_bats_start);

    }


};



module.exports = reality;