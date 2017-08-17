"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Vu Tien Dai on 28/06/2017.
 */
class Player {
    constructor(color, username) {
        this.team_color = color;
        this.username = username;
    }
    get name() {
        return this.username;
    }
    set name(value) {
        this.username = value;
    }
    get turn() {
        return this._turn;
    }
    set turn(value) {
        this._turn = value;
    }
    get color() {
        return this.team_color;
    }
    set color(value) {
        this.team_color = value;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map