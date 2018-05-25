"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
const gsap = require("gsap");
var TweenMax = gsap.TweenMax;
const viewGame_1 = require("../viewGame/viewGame");
const Stone_1 = require("./Stone");
const Game_1 = require("../viewGame/Game");
const util_1 = require("util");
/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
class Square extends Container {
    constructor(count = 0, type, index, ct) {
        super();
        this.count = count;
        this.maxWidth = 64;
        this.maxHeight = 56;
        this.minDis = 5;
        this.pos = 1;
        this.seq = 0;
        this.player = viewGame_1.viewGame.player;
        this.timeout = 0;
        this.Seq_Eat = false;
        this.Poit = 0;
        this.onDragStart = (event) => {
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            this.posx = this.x;
            this.posy = this.y;
            this.scale.set(1.1);
        };
        this.onDragEnd = () => {
            this.scale.set(1);
            if (this.data == null)
                return;
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
            this.onCanMove(this);
        };
        this.onDragMove = () => {
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x - 40;
                this.y = newPosition.y - 40;
            }
        };
        this.onStopMove = (ct) => {
            let arraySquare = ct.parent.children; //12 ô
            for (let i = 0; i < arraySquare.length; i++) {
                if (i < 12) {
                    arraySquare[i].rePos();
                    arraySquare[i].scale.set(1);
                    arraySquare[i].alpha = 1;
                    arraySquare[i].dragging = false;
                    arraySquare[i].data = null;
                }
            }
            arraySquare[0].parent.interactiveChildren = false;
        };
        this.onStartMove = (ct) => {
            let arraySquare = ct.parent.children; //12 ô
            arraySquare[0].parent.interactiveChildren = true;
        };
        this.onCanMove = (ct) => {
            let arraySquare = ct.parent.children; //12 ô
            if (ct.y > this.posy - 80 && ct.y < this.posy + 80 && (ct.x < this.posx + 150 && ct.x > this.posx + 40)) {
                this.player.emit("move", { posi: this.index + 6, dr: false });
                this.ct.clock.stop();
                this.onMoveRight(ct);
            }
            else if (ct.y > this.posy - 80 && ct.y < this.posy + 80 && (ct.x > this.posx - 150 && ct.x < this.posx - 40)) {
                this.player.emit("move", { posi: this.index + 6, dr: true });
                this.ct.clock.stop();
                this.onMoveLeft(ct);
            }
            ct.position.set(this.posx, this.posy);
        };
        this.onEatRight = (arraySquare, Box, v) => {
            let one = arraySquare[0].children.length;
            let two = arraySquare[6].children.length;
            if (arraySquare[v].children.length == 0) {
                this.stop = true;
                let check = false;
                if (this.pos == 4) {
                    if (two > 4) {
                        this.pos = 6;
                        check = true;
                    }
                    else {
                        this.checkForRight(arraySquare, Box, v);
                        return;
                    }
                }
                else if (this.pos == 10) {
                    if (one > 4) {
                        this.pos = 0;
                        check = true;
                    }
                    else {
                        this.checkForRight(arraySquare, Box, v);
                        return;
                    }
                }
                else if (this.pos != 4 && this.pos != 10) {
                    this.pos = this.pos + 2;
                    if (this.pos == 13)
                        this.pos = 1;
                    if (this.pos == 12)
                        this.pos = 0;
                    if (arraySquare[this.pos].children.length == 0) {
                        this.checkForRight(arraySquare, Box, v);
                        return;
                    }
                    check = true;
                }
                if (check == true) {
                    let box1 = Box[this.pos];
                    box1.setText('0');
                    let oldPos = new PIXI.Point(arraySquare[this.pos].position.x, arraySquare[this.pos].position.y);
                    arraySquare[14].position.set(oldPos.x, oldPos.y);
                    this.MoveEat(arraySquare[this.pos], arraySquare[14]);
                    if (viewGame_1.viewGame.turn != viewGame_1.viewGame.game_turn) {
                        let square = arraySquare[13];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                        setTimeout(() => {
                            if (this.pos == 0 || this.pos == 6 && this.Seq_Eat == false) {
                                if (this.checkPoint(arraySquare[14]) < 20)
                                    viewGame_1.viewGame.sound.play_Voice("AnQuan");
                                else
                                    viewGame_1.viewGame.sound.play_Voice("TrungLon");
                            }
                            else if (this.Seq_Eat == false && this.pos != 0 && this.pos != 6)
                                viewGame_1.viewGame.sound.play_Voice("An");
                            this.MoveEat(arraySquare[14], arraySquare[13]);
                            let box2 = Box[13];
                            box2.setText(this.checkPoint(square));
                            this.Seq_Eat = true;
                            v = this.pos + 1;
                            if (v == 12)
                                v = 0;
                            this.onEatRight(arraySquare, Box, v);
                            return;
                        }, 400);
                    }
                    else {
                        let square = arraySquare[12];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                        setTimeout(() => {
                            if (this.pos == 0 || this.pos == 6 && this.Seq_Eat == false) {
                                if (this.checkPoint(arraySquare[14]) < 18)
                                    viewGame_1.viewGame.sound.play_Voice("AnQuan");
                                else
                                    viewGame_1.viewGame.sound.play_Voice("TrungLon");
                            }
                            else if (this.Seq_Eat == false && this.pos != 0 && this.pos != 6)
                                viewGame_1.viewGame.sound.play_Voice("An");
                            this.MoveEat(arraySquare[14], arraySquare[12]);
                            let box2 = Box[12];
                            box2.setText(this.checkPoint(square));
                            this.Seq_Eat = true;
                            v = this.pos + 1;
                            if (v == 12)
                                v = 0;
                            this.onEatRight(arraySquare, Box, v);
                            return;
                        }, 400);
                    }
                }
                else {
                    this.checkForRight(arraySquare, Box, v);
                    return;
                }
            }
            else {
                this.checkForRight(arraySquare, Box, v);
                return;
            }
        };
        this.onMoveRight = (ct) => {
            this.stop = false;
            let arraySquare = ct.parent.children; //12 ô
            let arrayBox = ct.parent.parent.getChildAt(1); //12 ô
            let Box = arrayBox.children; //12 ô
            var j = ct.parent.getChildIndex(ct); //vị trí bắt đầu ném đá vào
            let oldPos = new PIXI.Point(ct.position.x, ct.position.y);
            let spread = arraySquare[14];
            spread.position.set(oldPos.x, oldPos.y);
            this.MoveEat(ct, spread);
            let arrayStone = spread.children;
            let n = arrayStone.length;
            Box[j].setText("0");
            this.onStopMove(ct);
            for (let i = 0; i < n; i++) {
                setTimeout(() => {
                    j++;
                    if (j >= 12)
                        j = 0;
                    let square = arraySquare[j];
                    let box = Box[j];
                    if (j == 0) {
                        TweenMax.to(spread, 0.4, { x: 113, y: 92 });
                        // setTimeout(() => {
                        if (!util_1.isNullOrUndefined(arrayStone[0])) {
                            let y = arrayStone[0].y + 20;
                            let x = arrayStone[0].x + 5;
                            viewGame_1.viewGame.sound.play_Voice("Stone");
                            arrayStone[0].position.set(x, y);
                            square.addChild(arrayStone[0]);
                            box.setText(this.checkPoint(square));
                        }
                        // }, 400);
                    }
                    else if (j == 6) {
                        TweenMax.to(spread, 0.4, { x: 575, y: 130 });
                        // setTimeout(() => {
                        if (!util_1.isNullOrUndefined(arrayStone[0])) {
                            let y = arrayStone[0].y + 65;
                            viewGame_1.viewGame.sound.play_Voice("Stone");
                            arrayStone[0].position.y = y;
                            square.addChild(arrayStone[0]);
                            box.setText(this.checkPoint(square));
                        }
                        // }, 400);
                    }
                    else {
                        TweenMax.to(spread, 0.4, { x: square.x, y: square.y });
                        // setTimeout(() =>{
                        if (!util_1.isNullOrUndefined(arrayStone[0])) {
                            viewGame_1.viewGame.sound.play_Voice("Stone");
                            square.addChild(arrayStone[0]);
                            box.setText(this.checkPoint(square));
                        }
                    }
                    // }, 400);
                }, (i + 1) * 500);
            }
            setTimeout(() => {
                this.pos = j;
                let v = j + 1;
                if (v == 12)
                    v = 0;
                console.log("nhucc " + n + "    " + arrayStone.length);
                this.onEatRight(arraySquare, Box, v);
            }, (n + 1) * 600);
        };
        this.onMoveLeft = (ct) => {
            this.stop = false;
            let arraySquare = ct.parent.children; //12 ô
            let arrayBox = ct.parent.parent.getChildAt(1); //12 ô
            let Box = arrayBox.children; //12 ô
            var j = ct.parent.getChildIndex(ct); //vị trí bắt đầu ném đá vào
            let oldPos = new PIXI.Point(ct.position.x, ct.position.y);
            let spread = arraySquare[14];
            spread.position.set(oldPos.x, oldPos.y);
            this.MoveEat(ct, spread);
            let arrayStone = spread.children;
            let n = arrayStone.length;
            Box[j].setText("0");
            this.onStopMove(ct);
            for (let i = 0; i < n; i++) {
                setTimeout(() => {
                    j--;
                    if (j <= -1)
                        j = 11;
                    let square = arraySquare[j];
                    let box = Box[j];
                    if (j == 0) {
                        let y = arrayStone[0].y + 20;
                        let x = arrayStone[0].x + 5;
                        TweenMax.to(spread, 0.4, { x: 113, y: 92 });
                        // setTimeout(() => {
                        if (!util_1.isNullOrUndefined(arrayStone[0])) {
                            viewGame_1.viewGame.sound.play_Voice("Stone");
                            arrayStone[0].position.set(x, y);
                            square.addChild(arrayStone[0]);
                            box.setText(this.checkPoint(square));
                        }
                        // }, 400);
                    }
                    else if (j == 6) {
                        let y = arrayStone[0].y + 50;
                        TweenMax.to(spread, 0.4, { x: 575, y: 130 });
                        // setTimeout(() => {
                        if (!util_1.isNullOrUndefined(arrayStone[0])) {
                            viewGame_1.viewGame.sound.play_Voice("Stone");
                            arrayStone[0].position.y = y;
                            square.addChild(arrayStone[0]);
                            box.setText(this.checkPoint(square));
                        }
                        // }, 400);
                    }
                    else {
                        TweenMax.to(spread, 0.4, { x: square.x, y: square.y });
                        // setTimeout(() => {
                        if (!util_1.isNullOrUndefined(arrayStone[0])) {
                            viewGame_1.viewGame.sound.play_Voice("Stone");
                            square.addChild(arrayStone[0]);
                            box.setText(this.checkPoint(square));
                        }
                        // }, 400);
                    }
                }, i * 600);
            }
            setTimeout(() => {
                this.pos = j;
                let v = j - 1;
                if (v == -1)
                    v = 11;
                console.log("nhucc " + n + "    " + arrayStone.length);
                this.onEatLeft(arraySquare, Box, v);
            }, (n + 1) * 600);
        };
        this.onEatLeft = (arraySquare, Box, v) => {
            let check;
            let one = arraySquare[0].children.length;
            let two = arraySquare[6].children.length;
            if (arraySquare[v].children.length == 0) {
                this.stop = true;
                if (this.pos == 8) {
                    if (two > 4) {
                        this.pos = 6;
                        check = true;
                    }
                    else {
                        this.checkForLeft(arraySquare, Box, v);
                        return;
                    }
                }
                else if (this.pos == 2) {
                    if (one > 4) {
                        this.pos = 0;
                        check = true;
                    }
                    else {
                        this.checkForLeft(arraySquare, Box, v);
                        return;
                    }
                }
                else if (this.pos != 2 && this.pos != 8) {
                    this.pos = this.pos - 2;
                    if (this.pos == -2)
                        this.pos = 10;
                    if (this.pos == -1)
                        this.pos = 11;
                    if (arraySquare[this.pos].children.length == 0) {
                        this.checkForLeft(arraySquare, Box, v);
                        return;
                    }
                    check = true;
                }
                if (check == true) {
                    let box1 = Box[this.pos];
                    box1.setText('0');
                    let oldPos = new PIXI.Point(arraySquare[this.pos].position.x, arraySquare[this.pos].position.y);
                    arraySquare[14].position.set(oldPos.x, oldPos.y);
                    this.MoveEat(arraySquare[this.pos], arraySquare[14]);
                    if (viewGame_1.viewGame.turn != viewGame_1.viewGame.game_turn) {
                        let square = arraySquare[13];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                        setTimeout(() => {
                            if (this.pos == 0 || this.pos == 6 && this.Seq_Eat == false) {
                                if (this.checkPoint(arraySquare[14]) < 20)
                                    viewGame_1.viewGame.sound.play_Voice("AnQuan");
                                else
                                    viewGame_1.viewGame.sound.play_Voice("TrungLon");
                            }
                            else if (this.Seq_Eat == false && this.pos != 0 && this.pos != 6)
                                viewGame_1.viewGame.sound.play_Voice("An");
                            this.MoveEat(arraySquare[14], arraySquare[13]);
                            let box2 = Box[13];
                            box2.setText(this.checkPoint(square));
                            this.Seq_Eat = true;
                            v = this.pos - 1;
                            if (v == -1)
                                v = 11;
                            this.onEatLeft(arraySquare, Box, v);
                            return;
                        }, 400);
                    }
                    else {
                        let square = arraySquare[12];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                        setTimeout(() => {
                            if (this.pos == 0 || this.pos == 6 && this.Seq_Eat == false) {
                                if (this.checkPoint(arraySquare[14]) < 18)
                                    viewGame_1.viewGame.sound.play_Voice("AnQuan");
                                else
                                    viewGame_1.viewGame.sound.play_Voice("TrungLon");
                            }
                            else if (this.Seq_Eat == false && this.pos != 0 && this.pos != 6)
                                viewGame_1.viewGame.sound.play_Voice("An");
                            this.MoveEat(arraySquare[14], arraySquare[12]);
                            let box2 = Box[12];
                            box2.setText(this.checkPoint(square));
                            this.Seq_Eat = true;
                            v = this.pos - 1;
                            if (v == -1)
                                v = 11;
                            this.onEatLeft(arraySquare, Box, v);
                            return;
                        }, 400);
                    }
                }
                else {
                    this.checkForLeft(arraySquare, Box, v);
                    return;
                }
            }
            else {
                this.checkForLeft(arraySquare, Box, v);
                return;
            }
        };
        this.ct = ct;
        this.index = index;
        if (type == 1 || type == 2) {
            this.addStone(count, type, type);
        }
        else {
            this.addStone(count, 0, 0);
        }
        if (index > 0 && index < 6) {
            this.interactive = true;
            this.on('pointerdown', this.onDragStart)
                .on('pointerup', this.onDragEnd)
                .on('pointerupoutside', this.onDragEnd)
                .on('pointermove', this.onDragMove)
                .on("pointerover", () => {
                this.scale.set(1.1);
            })
                .on("pointerout", () => {
                this.scale.set(1);
            })
                .on("finish move", () => {
            });
        }
    }
    addStone(count, type, s) {
        this.createStone(35, 35, type, s);
    }
    setPos(x, y) {
        this.posx = x;
        this.posy = y;
    }
    rePos() {
        this.position.set(this.posx, this.posy);
    }
    createStone(x, y, type, s) {
        if (this.count > 0) {
            let stone;
            let rdX;
            let rdY;
            if (type == 1) {
                stone = new Stone_1.Stone(1);
                stone.x = 27;
                stone.y = 95;
            }
            else if (type == 2) {
                stone = new Stone_1.Stone(2);
                stone.x = 13;
                stone.y = 20;
            }
            else {
                stone = new Stone_1.Stone(0);
                stone.anchor.set(0.5);
                stone.x = x;
                stone.y = y;
            }
            rdX = Math.floor((Math.random() - Math.random()) * 15) + 20;
            rdY = Math.floor((Math.random() - Math.random()) * 25) + 30;
            this.addChild(stone);
            this.count--;
            this.createStone(rdX, rdY, 0, s);
        }
    }
    checkStoneLast(arraySquare) {
        let team1 = 0;
        let team2 = 0;
        for (let i = 0; i < arraySquare.length; i++) {
            if (i > 0 && i < 6) {
                if (arraySquare[i].children.length == 0) {
                    team1++;
                }
            }
            if (i > 6 && i < 12) {
                if (arraySquare[i].children.length == 0) {
                    team2++;
                }
            }
        }
        let time = 0;
        if (team1 == 5) {
            this.SpeardStone(arraySquare, 1);
            time = 450 * 5;
        }
        if (team2 == 5) {
            setTimeout(() => {
                this.SpeardStone(arraySquare, 2);
            }, time);
        }
    }
    SpeardStone(arraySquare, team) {
        let arrayBox = arraySquare[1].parent.parent.getChildAt(1); //12 ô
        let Box = arrayBox.children; //12 ô
        let spread = arraySquare[14];
        let oldPos;
        if (team == 1) {
            oldPos = new PIXI.Point(arraySquare[12].position.x, arraySquare[12].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            let Square = arraySquare[12].children;
            let n = Square.length;
            let count = 0;
            let isExist = false;
            for (let i = 0; i < n; i++) {
                let x = Square[i].getType;
                if (x == 0) {
                    Square[i].position.set(35, 35);
                    spread.addChild(Square[i]);
                    i--;
                    count++;
                }
                else
                    isExist = true;
                if (count == 5)
                    break;
                if (isExist == false && count == n)
                    break;
                if (isExist == true && count == n - 1)
                    break;
            }
            let Stone = spread.children;
            let m = Stone.length;
            count = 1;
            if (m == 0) {
                viewGame_1.viewGame.player.emit("end game", { team: viewGame_1.viewGame.game_turn, result: 3, src: 0, src1: 0 });
            }
            for (let i = 0; i < m; i++) {
                setTimeout(() => {
                    TweenMax.to(spread, 0.4, { x: arraySquare[count].x, y: arraySquare[count].y });
                    setTimeout(() => {
                        let box = Box[count];
                        viewGame_1.viewGame.sound.play_Voice("Stone");
                        arraySquare[count].addChild(Stone[0]);
                        box.setText(this.checkPoint(arraySquare[count]));
                        count++;
                        let box1 = Box[12];
                        box1.setText(this.checkPoint(arraySquare[12]) + this.checkPoint(spread));
                    }, 420);
                }, 450 * i);
            }
        }
        if (team == 2) {
            oldPos = new PIXI.Point(arraySquare[13].position.x, arraySquare[13].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            let Square = arraySquare[13].children;
            let n = Square.length;
            let count = 0;
            let isExist = false;
            for (let i = 0; i < n; i++) {
                let x = Square[i].getType;
                if (x == 0) {
                    Square[i].position.set(35, 35);
                    spread.addChild(Square[i]);
                    i--;
                    count++;
                }
                else
                    isExist = true;
                if (count == 5)
                    break;
                if (isExist == false && count == n)
                    break;
                if (isExist == true && count == n - 1)
                    break;
            }
            count = 7;
            let Stone = spread.children;
            let m = Stone.length;
            for (let i = 0; i < m; i++) {
                setTimeout(() => {
                    TweenMax.to(spread, 0.4, { x: arraySquare[count].x, y: arraySquare[count].y });
                    setTimeout(() => {
                        let box = Box[count];
                        viewGame_1.viewGame.sound.play_Voice("Stone");
                        arraySquare[count].addChild(Stone[0]);
                        box.setText(this.checkPoint(arraySquare[count]));
                        count++;
                        let box1 = Box[13];
                        box1.setText(this.checkPoint(arraySquare[13]) + this.checkPoint(spread));
                    }, 420);
                }, 450 * i);
            }
        }
    }
    MoveEat(ct1, ct2) {
        let n = ct1.children.length;
        for (let i = 0; i < n; i++) {
            if (ct1.children[0].x > 60 || ct1.children[0].y > 60)
                ct1.children[0].position.set(Math.random() * 45, Math.random() * 45);
            ct2.addChild(ct1.children[0]);
        }
    }
    checkForRight(arraySquare, Box, v) {
        this.Seq_Eat = false;
        this.timeout = 0;
        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 5 && this.pos != 11) {
            this.onMoveRight(arraySquare[v]);
        }
        else {
            this.checkEndGame(arraySquare, Box);
            if (Game_1.Game.endgame == false)
                this.checkStoneLast(arraySquare);
            if (viewGame_1.viewGame.game_turn != viewGame_1.viewGame.turn) {
                this.onStartMove(arraySquare[1]);
            }
            if (viewGame_1.viewGame.turn == viewGame_1.viewGame.game_turn)
                viewGame_1.viewGame.player.emit("change turn", true);
            else
                viewGame_1.viewGame.player.emit("change turn", false);
        }
    }
    checkForLeft(arraySquare, Box, v) {
        this.Seq_Eat = false;
        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 7 && this.pos != 1) {
            this.onMoveLeft(arraySquare[v]);
        }
        else {
            this.checkEndGame(arraySquare, Box);
            if (Game_1.Game.endgame == false)
                this.checkStoneLast(arraySquare);
            if (viewGame_1.viewGame.game_turn != viewGame_1.viewGame.turn) {
                this.onStartMove(arraySquare[1]);
            }
            if (viewGame_1.viewGame.turn == viewGame_1.viewGame.game_turn)
                viewGame_1.viewGame.player.emit("change turn", true);
            else
                viewGame_1.viewGame.player.emit("change turn", false);
        }
    }
    checkPoint(ct) {
        let stone = ct.children;
        let count = 0;
        for (let i = 0; i < stone.length; i++) {
            count += stone[i].getPoint;
        }
        return count;
    }
    checkEndGame(arraySquare, Box) {
        let Stone1 = arraySquare[12].children;
        let n1 = Stone1.length;
        let count = 0;
        for (let i = 0; i < n1; i++) {
            if (Stone1[i].getType != 0)
                count++;
        }
        let Stone2 = arraySquare[13].children;
        let n2 = Stone2.length;
        for (let i = 0; i < n2; i++) {
            if (Stone2[i].getType != 0)
                count++;
        }
        if (count == 2) {
            setTimeout(() => {
                if (Math.random() * 2 > 1)
                    viewGame_1.viewGame.sound.play_Voice("TQKV");
                else
                    viewGame_1.viewGame.sound.play_Voice("TQBR");
            }, 1000);
            Game_1.Game.endgame = true;
            this.countPoit(arraySquare, Box);
        }
    }
    countPoit(arraySquare, Box) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                let home1 = Box[12];
                let home2 = Box[13];
                TweenMax.to(arraySquare[i], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                setTimeout(() => {
                    let box = Box[i];
                    let oldPos = new PIXI.Point(arraySquare[i].x, arraySquare[i].y);
                    this.MoveEat(arraySquare[i], arraySquare[12]);
                    arraySquare[i].position.set(oldPos.x, oldPos.y);
                    box.setText(this.checkPoint(arraySquare[i]));
                    home1.setText(this.checkPoint(arraySquare[12]));
                }, 400);
                TweenMax.to(arraySquare[i + 6], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                setTimeout(() => {
                    let box = Box[i + 6];
                    let oldPos = new PIXI.Point(arraySquare[i + 6].x, arraySquare[i + 6].y);
                    this.MoveEat(arraySquare[i + 6], arraySquare[13]);
                    arraySquare[i].position.set(oldPos.x, oldPos.y);
                    box.setText(this.checkPoint(arraySquare[i + 6]));
                    home2.setText(this.checkPoint(arraySquare[13]));
                }, 400);
            }, (i + 1) * 420);
        }
        let count1;
        let count2;
        setTimeout(() => {
            count1 = this.checkPoint(arraySquare[12]);
            count2 = this.checkPoint(arraySquare[13]);
            if (viewGame_1.viewGame.turn == viewGame_1.viewGame.game_turn) {
                if (count1 > count2)
                    viewGame_1.viewGame.player.emit("end game", {
                        team: viewGame_1.viewGame.game_turn,
                        result: 1,
                        src: count1 - count2,
                        src1: count2 - count1
                    });
                else if (count1 < count2)
                    viewGame_1.viewGame.player.emit("end game", {
                        team: viewGame_1.viewGame.game_turn,
                        result: 3,
                        src: count1 - count2,
                        src1: count2 - count1
                    });
                else
                    viewGame_1.viewGame.player.emit("end game", {
                        team: viewGame_1.viewGame.game_turn,
                        result: 2,
                        src: count1 - count2,
                        src1: 0
                    });
            }
        }, 7 * 430);
    }
}
exports.Square = Square;
//# sourceMappingURL=SquareContainer.js.map