import Container = PIXI.Container;
import * as gsap from "gsap"
import TweenMax = gsap.TweenMax;
import {Box} from "./BoxContainer";
import {viewGame} from "../viewGame/viewGame";
import {Stone} from "./Stone";
import {Player} from "../Player";

/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
export class Square extends Container {
    maxWidth = 64;
    maxHeight = 56;
    minDis = 5;
    posx;
    posy;
    index;
    data;
    dragging;
    pos = 1;
    stop;
    seq = 0;
    endgame = false;
    player: Player = viewGame.player;

    constructor(public count = 0, type, index) {
        super();
        this.index = index;
        if (type == 1 || type == 2) {
            this.addStone(count, type, type);

        } else {
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
                    if (viewGame.turn == viewGame.game_turn)
                        viewGame.player.emit("change turn");
                });


        }

    }

    public addStone(count: number, type, s) {
        this.createStone(35, 35, type, s);
    }

    private createStone(x, y, type, s) {
        if (this.count > 0) {
            let stone;
            let rdX;
            let rdY;
            if (type == 1) {
                stone = new Stone(1);
                stone.x = 27;
                stone.y = 95

            }
            else if (type == 2) {
                stone = new Stone(2);
                stone.x = 13;
                stone.y = 20;
            }
            else {
                stone = new Stone(0);
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

    checkStoneLast(arraySquare: PIXI.Container[]) {
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
        if (team1 == 5) {
            this.SpeardStone(arraySquare, 1);
        }
        if (team2 == 5) {
            this.SpeardStone(arraySquare, 2);
        }

    }

    SpeardStone(arraySquare: PIXI.Container[], team: number) {
        let arrayBox: PIXI.Container = <PIXI.Container>arraySquare[1].parent.parent.getChildAt(1);//12 ô
        let Box = arrayBox.children;//12 ô
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
                let x = (<Stone> Square[i]).getType;
                if (x == 0) {
                    spread.addChild(Square[i]);
                    i--;
                    count++
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

            let Stone = spread.children
            let m = Stone.length;
            count = 1;
            if (m == 0) {
                viewGame.player.emit("end game", {team: viewGame.game_turn, result: 3});
            }
            for (let i = 0; i < m; i++) {
                setTimeout(() => {
                    TweenMax.to(spread, 0.4, {x: arraySquare[count].x, y: arraySquare[count].y})
                    setTimeout(() => {
                        let box = <Box> Box[count];
                        Stone[0].position.set(35, 35);
                        arraySquare[count].addChild(Stone[0]);
                        box.setText(this.checkPoint(arraySquare[count]));
                        count++;
                        let box1 = <Box> Box[12];
                        box1.setText(this.checkPoint(arraySquare[12]) + this.checkPoint(spread));
                    }, 450);
                }, 700 + 470 * i)
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
                let x = (<Stone> Square[i]).getType;
                if (x == 0) {
                    spread.addChild(Square[i]);
                    i--;
                    count++
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
            let Stone = spread.children
            let m = Stone.length;
            for (let i = 0; i < m; i++) {
                setTimeout(() => {
                    TweenMax.to(spread, 0.4, {x: arraySquare[count].x, y: arraySquare[count].y});
                    setTimeout(() => {
                        let box = <Box> Box[count];
                        Stone[0].position.set(35, 35);
                        arraySquare[count].addChild(Stone[0]);
                        box.setText(this.checkPoint(arraySquare[count]));
                        count++;
                        let box1 = <Box> Box[13];
                        box1.setText(this.checkPoint(arraySquare[13]) + this.checkPoint(spread))
                    }, 450);
                }, 700 + 470 * i)
            }
        }

    }

    onDragStart = (event) => {
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
        this.posx = this.x;
        this.posy = this.y;
        this.scale.set(1.1);
    }
    onDragEnd = () => {
        this.scale.set(1);
        if (this.data == null)
            return;
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
        this.onCanMove(this);
    }
    onDragMove = () => {
        if (this.dragging) {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x - 40;
            this.y = newPosition.y - 40;
        }
    }
    onStopMove = (ct: PIXI.Container) => {
        let arraySquare: PIXI.Container[] = <PIXI.Container[]>ct.parent.children;//12 ô
        for (let i = 0; i < arraySquare.length; i++) {
            arraySquare[i].interactive = false;
        }
    }
    onStartMove = (ct: PIXI.Container) => {
        let arraySquare: PIXI.Container[] = <PIXI.Container[]>ct.parent.children;//12 ô
        for (let i = 0; i < arraySquare.length; i++) {
            arraySquare[i].interactive = true;
        }
    }
    onCanMove = (ct: PIXI.Container) => {
        let arraySquare: PIXI.Container[] = <PIXI.Container[]>ct.parent.children;//12 ô
        if (ct.y > this.posy - 80 && ct.y < this.posy + 80 && (ct.x < this.posx + 150 && ct.x > this.posx + 40)) {
            this.player.emit("move", {posi: this.index + 6, dr: false});
            viewGame.clock.stop();
            this.onMoveRight(ct);

        }
        else if (ct.y > this.posy - 80 && ct.y < this.posy + 80 && (ct.x > this.posx - 150 && ct.x < this.posx - 40)) {
            this.player.emit("move", {posi: this.index + 6, dr: true});
            viewGame.clock.stop();
            this.onMoveLeft(ct);
        }

        ct.position.set(this.posx, this.posy);
    }

    MoveEat(ct1: Container, ct2: Container) {
        let n = ct1.children.length;
        for (let i = 0; i < n; i++) {
            if (ct1.children[0].x > 60 || ct1.children[0].y > 60)
                ct1.children[0].position.set(Math.random() * 45, Math.random() * 45);
            ct2.addChild(ct1.children[0]);
        }

    }

    onEatRight = (arraySquare: PIXI.Container[], Box) => {
        let check;
        let s = 1;
        let one = arraySquare[0].children.length;
        let two = arraySquare[6].children.length;
        let v = this.pos + 1;
        if (v == 12)
            v = 0
        while (arraySquare[v].children.length == 0) {
            this.stop = true;
            let check = false;
            if (this.pos == 4) {
                if (two > 4) {
                    this.pos = 6;
                    check = true;
                }
                else
                    break;
            }
            else if (this.pos == 10) {
                if (one > 4) {
                    this.pos = 0;
                    check = true;
                }
                else
                    break;

            }
            else if (this.pos != 4 && this.pos != 10) {
                this.pos = this.pos + 2;
                if (this.pos == 13)
                    this.pos = 1;
                if (this.pos == 12)
                    this.pos = 0;
                if (arraySquare[this.pos].children.length == 0) {
                    break;
                }
                check = true;
            }
            if (check == true) {
                let box1 = <Box> Box[this.pos];
                box1.setText('0');
                let oldPos = new PIXI.Point(arraySquare[this.pos].position.x, arraySquare[this.pos].position.y);
                arraySquare[14].position.set(oldPos.x, oldPos.y);
                this.MoveEat(arraySquare[this.pos], arraySquare[14]);
                if (viewGame.turn != viewGame.game_turn) {
                    let square = arraySquare[13];
                    TweenMax.to(arraySquare[14], 0.4, {x: arraySquare[13].x, y: arraySquare[13].y});
                    setTimeout(() => {
                        this.MoveEat(arraySquare[14], arraySquare[13]);
                        let box2 = <Box> Box[13];
                        box2.setText(this.checkPoint(square));
                    }, s * 400);
                }
                else {
                    let square = arraySquare[12];
                    TweenMax.to(arraySquare[14], 0.4, {x: arraySquare[12].x, y: arraySquare[12].y});
                    setTimeout(() => {
                        this.MoveEat(arraySquare[14], arraySquare[12]);
                        let box2 = <Box> Box[12];
                        box2.setText(this.checkPoint(square));
                    }, s * 400);
                }
            }
            s++;
            v = this.pos + 1;
            if (v == 12)
                v = 0
            one = arraySquare[0].children.length;
            two = arraySquare[6].children.length;
            // if(arraySquare[v].children.length == 0)

        }

    }
    onMoveRight = (ct: PIXI.Container) => {
        this.stop = false;
        let arraySquare: PIXI.Container[] = <PIXI.Container[]>ct.parent.children;//12 ô
        let arrayBox: PIXI.Container = <PIXI.Container>ct.parent.parent.getChildAt(1);//12 ô
        let Box = arrayBox.children;//12 ô
        let Stone = ct.children;//số đá trong ô hiện tại
        var j = ct.parent.getChildIndex(ct);//vị trí bắt đầu ném đá vào
        let oldPos = new PIXI.Point(ct.position.x, ct.position.y);
        let spread = arraySquare[14];
        spread.position.set(oldPos.x, oldPos.y);
        let l = Stone.length;
        for (let i = 0; i < l; i++) {
            spread.addChild(Stone[0]);
        }
        let arrayStone = spread.children;
        let n = arrayStone.length;
        (<Box> Box[j]).setText("0");
        this.onStopMove(ct);
        for (let i = 0; i < n; i++) {
            setTimeout(() => {
                j++;
                if (j >= 12) j = 0;
                let square = arraySquare[j];
                let box = <Box> Box[j];
                if (j == 0) {
                    let y = arrayStone[0].y + 20;
                    let x = arrayStone[0].x + 5;
                    TweenMax.to(spread, 0.4, {x: 113, y: 92});
                    setTimeout(() => {
                        arrayStone[0].position.set(x, y);
                        square.addChild(arrayStone[0]);
                        box.setText(this.checkPoint(square));

                    }, 450);
                }
                else if (j == 6) {
                    let y = arrayStone[0].y + 65;
                    TweenMax.to(spread, 0.4, {x: 575, y: 130});
                    setTimeout(() => {
                        arrayStone[0].position.y = y;
                        square.addChild(arrayStone[0]);
                        box.setText(this.checkPoint(square));
                    }, 450);
                }
                else {
                    TweenMax.to(spread, 0.4, {x: square.x, y: square.y});
                    setTimeout(() => {
                        square.addChild(arrayStone[0]);
                        box.setText(this.checkPoint(square));
                    }, 450);
                }

            }, i * 450 + 550);
        }
        setTimeout(() => {
            this.pos = j;
            let v = j + 1;
            if (v == 12) v = 0;
            this.onEatRight(arraySquare, Box);
            this.checkForRight(arraySquare, v, Box, ct);


        }, n * 450 + 650);
    }

    checkForRight(arraySquare: PIXI.Container[], v, Box, ct) {

        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 5 && this.pos != 11) {
            this.posx = arraySquare[v].x;
            this.posy = arraySquare[v].y;
            this.onMoveRight(arraySquare[v]);
        }
        else {
        setTimeout(() => {
            this.checkEndGame(arraySquare, Box);
            if (this.endgame == false)
                this.checkStoneLast(arraySquare);
            if (viewGame.game_turn != viewGame.turn) {
                this.onStartMove(arraySquare[1]);
            }
            this.emit("finish move");
        }, 500);
        }

    }

    onEatLeft = (arraySquare: PIXI.Container[], Box) => {
        let check;
        let one = arraySquare[0].children.length;
        let two = arraySquare[6].children.length;
        let v = this.pos - 1;
        if (v == -1)
            v = 11
        while (arraySquare[v].children.length == 0) {
            this.stop = true;
            if (this.pos == 8) {
                if (two > 4) {
                    this.pos = 6;
                    check = true;
                }
                else
                    break;
            }
            else if (this.pos == 2) {
                if (one > 4) {
                    this.pos = 0;
                    check = true;
                }
                else
                    break;

            }
            else if (this.pos != 2 && this.pos != 8) {
                this.pos = this.pos - 2;
                if (this.pos == -2)
                    this.pos = 10;
                if (this.pos == -1)
                    this.pos = 11;
                if (arraySquare[this.pos].children.length == 0) {
                    break;
                }
                check = true;
            }
            if (check == true) {
                let box1 = <Box> Box[this.pos];
                box1.setText('0');
                let oldPos = new PIXI.Point(arraySquare[this.pos].position.x, arraySquare[this.pos].position.y);
                arraySquare[14].position.set(oldPos.x, oldPos.y);
                this.MoveEat(arraySquare[this.pos], arraySquare[14]);
                if (viewGame.turn != viewGame.game_turn) {
                    let square = arraySquare[13];
                    TweenMax.to(arraySquare[14], 0.4, {x: arraySquare[13].x, y: arraySquare[13].y});
                    setTimeout(() => {
                        this.MoveEat(arraySquare[14], arraySquare[13]);
                        let box2 = <Box> Box[13];
                        box2.setText(this.checkPoint(square));
                    }, 400);
                }
                else {
                    let square = arraySquare[12];
                    TweenMax.to(arraySquare[14], 0.4, {x: arraySquare[12].x, y: arraySquare[12].y});
                    setTimeout(() => {
                        this.MoveEat(arraySquare[14], arraySquare[12]);
                        let box2 = <Box> Box[12];
                        box2.setText(this.checkPoint(square));
                    }, 400);
                }
            }
            v = this.pos - 1;
            if (v == -1)
                v = 11
            one = arraySquare[0].children.length;
            two = arraySquare[6].children.length;
        }
    }
    onMoveLeft = (ct: PIXI.Container) => {
        this.stop = false;
        let arraySquare: PIXI.Container[] = <PIXI.Container[]>ct.parent.children;//12 ô
        let arrayBox: PIXI.Container = <PIXI.Container>ct.parent.parent.getChildAt(1);//12 ô
        let Box = arrayBox.children;//12 ô
        let Stone = ct.children;//số đá trong ô hiện tại
        var j = ct.parent.getChildIndex(ct);//vị trí bắt đầu ném đá vào
        let oldPos = new PIXI.Point(ct.position.x, ct.position.y);
        let spread = arraySquare[14];
        spread.position.set(oldPos.x, oldPos.y);
        let l = Stone.length;
        for (let i = 0; i < l; i++) {
            spread.addChild(Stone[0]);
        }
        let arrayStone = spread.children;
        let n = arrayStone.length;
        (<Box> Box[j]).setText("0");
        this.onStopMove(ct);
        for (let i = 0; i < n; i++) {
            setTimeout(() => {
                j--;
                if (j <= -1) j = 11;
                let square = arraySquare[j];
                let box = <Box> Box[j];
                if (j == 0) {
                    let y = arrayStone[0].y + 20;
                    let x = arrayStone[0].x + 5;
                    TweenMax.to(spread, 0.4, {x: 113, y: 92});
                    setTimeout(() => {
                        arrayStone[0].position.set(x, y);
                        square.addChild(arrayStone[0]);
                        box.setText(this.checkPoint(square));

                    }, 450);
                }
                else if (j == 6) {
                    let y = arrayStone[0].y + 50;
                    TweenMax.to(spread, 0.4, {x: 575, y: 130});
                    setTimeout(() => {
                        arrayStone[0].position.y = y;
                        square.addChild(arrayStone[0]);
                        box.setText(this.checkPoint(square));
                    }, 450);
                }
                else {
                    TweenMax.to(spread, 0.4, {x: square.x, y: square.y});
                    setTimeout(() => {
                        square.addChild(arrayStone[0]);
                        box.setText(this.checkPoint(square));
                    }, 450);
                }

            }, i * 450 + 550);
            // console.log(Box);
        }
        setTimeout(() => {
            this.pos = j;
            let v = j - 1;
            if (v == -1) v = 11;
            this.onEatLeft(arraySquare, Box);
            this.checkForLeft(arraySquare, v, Box, ct);

        }, n * 450 + 650);
    }

    checkForLeft(arraySquare: PIXI.Container[], v, Box, ct) {
        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 7 && this.pos != 1) {
            this.posx = arraySquare[v].x;
            this.posy = arraySquare[v].y;
            this.onMoveLeft(arraySquare[v]);
        }
        else {
        setTimeout(() => {
            this.checkEndGame(arraySquare, Box);
            if (this.endgame == false)
                this.checkStoneLast(arraySquare);
            if (viewGame.game_turn != viewGame.turn) {
                this.onStartMove(arraySquare[1]);
            }
            this.emit("finish move");
        }, 400);
        }

    }

    checkPoint(ct: PIXI.Container): number {
        let stone = ct.children;
        let count = 0;
        for (let i = 0; i < stone.length; i++) {
            count += (<Stone>stone[i]).getPoint;
        }
        return count;
    }

    checkEndGame(arraySquare: PIXI.Container[], Box) {
        let Stone1 = arraySquare[12].children;
        let n1 = Stone1.length;
        let count = 0;
        for (let i = 0; i < n1; i++) {
            if ((<Stone> Stone1[i]).getType != 0)
                count++;
        }
        let Stone2 = arraySquare[13].children;
        let n2 = Stone2.length;
        for (let i = 0; i < n2; i++) {
            if ((<Stone> Stone2[i]).getType != 0)
                count++;
        }
        if (count == 2) {
             this.countPoit(arraySquare, Box)
            this.endgame = true;
        }
    }

    countPoit(arraySquare: PIXI.Container[], Box) {

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                let home1 = <Box> Box[12];
                let home2 = <Box> Box[13];
                TweenMax.to(arraySquare[i], 0.4, {x: arraySquare[12].x, y: arraySquare[12].y});
                setTimeout(() => {
                    let box = <Box> Box[i];
                    let oldPos = new PIXI.Point(arraySquare[i].x, arraySquare[i].y);
                    this.MoveEat(arraySquare[i], arraySquare[12]);
                    arraySquare[i].position.set(oldPos.x, oldPos.y);
                    box.setText(this.checkPoint(arraySquare[i]));
                    home1.setText(this.checkPoint(arraySquare[12]));
                    console.log("Nhu ccc");
                }, 400);

                TweenMax.to(arraySquare[i + 6], 0.4, {x: arraySquare[13].x, y: arraySquare[13].y});
                setTimeout(() => {
                    let box = <Box> Box[i + 6];
                    let oldPos = new PIXI.Point(arraySquare[i + 6].x, arraySquare[i + 6].y);
                    this.MoveEat(arraySquare[i + 6], arraySquare[13]);
                    arraySquare[i].position.set(oldPos.x, oldPos.y);
                    box.setText(this.checkPoint(arraySquare[i+6]));
                    home2.setText(this.checkPoint(arraySquare[13]));
                }, 400);
            }, (i + 1) * 450);
        }
        let count1;
        let count2;
        setTimeout(() => {
            count1 = this.checkPoint(arraySquare[12]);
            count2 = this.checkPoint(arraySquare[13]);
            if (count1 > count2)
                viewGame.player.emit("end game", {team: viewGame.game_turn, result: 1});
            else if (count1 < count2)
                viewGame.player.emit("end game", {team: viewGame.game_turn, result: 3});
            else
                viewGame.player.emit("end game", {team: viewGame.game_turn, result: 2});;
        }, 7 * 450);

    }
}