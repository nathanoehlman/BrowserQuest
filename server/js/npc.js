
module.exports = Npc = Character.extend({
    init: function(id, kind, x, y) {
        this._super(id, "npc", kind, x, y);
    }
});