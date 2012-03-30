var cls = require("./lib/class"),
    events = require('events'),
    util = require('util'),
    _ = require('underscore');

/**
Initialises the Orchestrator for a given world server (each WorldServer will
have it's own Orchestrator to manage the interactions)

Config is a JSON file containing the Orchestration events
**/
module.exports = Orchestrator = function(worldServer, config) {
    
    events.EventEmitter.call(this);
    
    var self = this;
    this.worldServer = worldServer;
    this.config = config;
    this.orchestrations = [];
    
    // Load the orchestrations
    if (config && config.orchestrations) {
        _.each(config.orchestrations, function(orchestration) {
            if (!orchestration || !orchestration.type) return;
            var HandlerClass = require('./orchestration/' + orchestration.type),
                instance = new HandlerClass(self, orchestration.config);
            
            self.orchestrations.push(instance);            
        });
    }

    var worldEvents = this.worldServer.events;

    console.log('Orchestrator initialised');
    setInterval(self.update.bind(self), 1000);
};
util.inherits(Orchestrator, events.EventEmitter);

/**
 Orchestrates the world interaction
**/
Orchestrator.prototype.update = function() {
    this.emit('update');
};

/**
  Returns the world server
 **/
Orchestrator.prototype.getWorldServer = function() {
    return this.worldServer;
}

/**
  Sends a message to the clients via the WorldServer
 **/
Orchestrator.prototype.sendAll = function(message) {
    if (!message) return;
    this.worldServer.pushBroadcast(message);
}