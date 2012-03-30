var cls = require("../lib/class"),
    Orchestration = require('./orchestration'),
    Message = require('../util/message');

/**
  Implement a Day/Night cycle
 **/
module.exports = DayNightCycle = Orchestration.extend({
    
    /**
      Initialises the day night orchestration
     **/
    init: function(orchestrator, config) {
        
        var self = this;
        this.orchestrator = orchestrator;
        this.worldServer = orchestrator.worldServer;
        this.enabled = false;
        this.started = false;
        this.time = null;
        this.day = true;
                
        // Check for valid passed options
        if (!orchestrator || !config) return;
        
        this.enabled = config.enabled || false;
        this.dayLength = config.day || 300000; // Day length in ms
        this.nightLength = config.night || 300000; // Day length in ms
        
        this.messages = config.messages || {day: ["The sun rises"], night: ["Evening falls"]};
        
        this.orchestrator.on('update', self.update.bind(self));
        // Send the current day night cycle to players on join
        this.worldServer.events.on('playerjoin', self.informPlayer.bind(self));
    },
    
    /**
      Starts the Day Night cycle
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
            this.change();
        }        
    },
    
    /**
      Returns true if the cycle needs to be changed
     **/
    requiresChange: function() {
        var changeAt = this.time + (this.day ? this.dayLength : this.nightLength);
        return Date.now() >= changeAt;
    },
    
    /**
      Toggles a change to the cycle
     **/
    change: function() {
        this.day = !this.day;
        this.time = Date.now();        
        this.orchestrator.sendAll(this.getUpdateMessage());
        console.log('Changed day/night cycle to ' + (this.day ? 'day' : 'night'));
    },
    
    /**
      Lets an individual player know about the current cycle
     **/
    informPlayer: function(player) {
        console.log('Sending day/night cycle to ' + player);
        this.worldServer.pushToPlayer(player, this.getUpdateMessage());
    },
    
    /**
      Gets the update message
     **/
    getUpdateMessage: function() {
        var type = this.day ? 'day' : 'night';
        
        return new Messages.Cycle(type, this.getRandomMessage(type));
    },
    
    /**
      Gets a random message
     **/
    getRandomMessage: function(type) {
        var options = this.messages[type] || ['Something unexpected has happened'];        
        return options[Math.floor(Math.random() * options.length)];
    }
    
});

var Messages = {
  
    Cycle: Message.extend({
    
        init: function(cycleTo, message) {
            this.cycleTo = cycleTo;
            this.message = message;
        },
    
        serialize: function() {
            return [Types.Messages.UPDATECYCLE,
                    this.cycleTo,
                    this.message];
        }
    })
};