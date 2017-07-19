/**
 * Created by Vu Tien Dai on 28/06/2017.
 */
export class Player {

    private team_color;
    private username;
    private _turn ;
    constructor(color: boolean, username) {
        this.team_color = color;
        this.username = username;
    }

    get name(): string {
        return this.username;
    }

    set name(value: string) {
        this.username = value;
    }
    get turn():number {
        return this._turn
    }
    set turn(value) {
        this._turn = value;
    }
    get color(): boolean {
        return this.team_color;
    }

    set color(value: boolean) {
        this.team_color = value;
    }
}