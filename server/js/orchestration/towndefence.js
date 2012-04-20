/**
  Town defence requires players to protect village NPC's
  
  When the latest NPC dies, the game is over. As time goes by, more and more attacks
  occur
**/
var cls = require("../lib/class"),
    Orchestration = require('./orchestration'),
    Types = require("../../../shared/js/gametypes");

module.exports = TownDefence = Orchestration.extend({
    
    /**
      Initialises the TownDefence orchestration
     **/
    init: function(orchestrator, config) {
        
        var self = this;
        this.orchestrator = orchestrator;
        this.worldServer = orchestrator.worldServer;
        this.enabled = false;
        this.started = false;
        this.wave = 0;
        this.time = null;
        this.spawned = {};
        this.waveInProgress = false;
                
        // Check for valid passed options
        if (!orchestrator || !config) return;

        this.enabled = config.enabled || false;
        this.timeBetween = config.timeBetweenWaves || 60000; // Time between waves
        this.config = config;
        this.orchestrator.on('update', self.update.bind(self));
    },
    
    /**
      Starts the Town Defence orchestration
     **/
    start: function() {
        if (this.started) return;
        this.time = Date.now();
        this.started = true;
    },
    
    update: function() {
        if (!this.started) {
            this.start();
        }
        if (this.requiresChange()) {
            this.spawnWave();
        }        
    },
    
    /**
      Wave activated
     **/
    requiresChange: function() {
        if (this.waveInProgress) return false;
        var changeAt = this.time + this.timeBetween;
        return Date.now() >= changeAt;
    },
    
    spawnWave: function() {
        console.log('Spawning wave - ' + this.wave);
        var wave = this.config.waves[this.wave],
            target = this.getNPCTarget(),
            spawns = wave.spawnAt, 
            sidx = 0,
            monster = 0,
            self = this; 
            
        this.waveInProgress = true;
        
        _.each(wave.monsters, function(value, key) {
            var kind = Types.getKindFromString(key),
                mobId = '101' + kind + self.wave + monster++,
                mob = new Mob(mobId, kind, spawns[sidx].x, spawns[sidx].y);
            
            self.worldServer.addMob(mob);
            self.worldServer.setMobTarget(mob, target);
            
            mob.events.on('died', function() {
                console.log('mob ' + mobId + ' died');
                delete self.spawned[mobId];
                if (_.size(self.spawned) == 0) {
                    self.waveEnded.bind(self)();
                }
            });
            
            mob.events.on('positioned', function(x, y) {
               console.log('mob ' + mobId + ' has moved to ' + x + ',' + y); 
            });
            self.spawned[mobId] = mob;
            console.log('spawned ' + key + ' [' + mobId + '] @ ' + spawns[sidx].x + ',' + spawns[sidx].y);            
            sidx++;
            if (spawns.length <= sidx) sidx = 0;

        });
        
    },
    
    waveEnded: function() {
        console.log('Wave ended');
        this.wave++;
        this.waveInProgress = false;
        this.time = Date.now();
    },
    
    /**
      Returns the unfortunate NPC who is the target
     **/
    getNPCTarget: function() {
        var target = null;
        _.each(this.worldServer.npcs, function(value, key) {
            if (!target) target = value;
        });
        return target;
    }
    
});