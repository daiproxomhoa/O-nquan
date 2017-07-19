import Container = PIXI.Container;
import {Utils} from "../Utils";
import DisplayObject = PIXI.DisplayObject;
import * as gsap from "gsap"
import TweenMax = gsap.TweenMax;
import {Box} from "./BoxContainer";
import {Player} from "./Player";
import {viewGame} from "../viewGame/viewGame";
import {Stone} from "./Stone";

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

    constructor(public count = 0, type, index, player ?: Player) {
        super();
        this.index = index;
        if (type == 1 || type == 2) {
            this.addStone(count, type, type);

        } else {
            this.addStone(count, 0, 0);
        }
        if (index != 0 && index != 6 && index != 12 && index != 13 && index != 14) {
            this.interactive = true;
            this.on('pointerdown', this.onDragStart)
                .on('pointerup', this.onDragEnd)
                .on('pointerupoutside', this.onDragEnd)
                .on('pointermove', this.onDragMove);

        }
        if (viewGame.turn == false && this.index > 6) {
            this.interactive = false;
        }

        if (viewGame.turn == true && this.index > 0 && this.index < 6) {
            this.interactive = false;
        }
        this.posx = this.x;
        this.posy = this.y;
    }

    public addStone(count: number, type, s) {
        // this.createStone(Math.floor((Math.random() - Math.random()) * 25) + 40, Math.floor((Math.random() - Math.random()) * 25) + 40, type, s);
        this.createStone(35, 35, type, s);
    }

    private createStone(x, y, type, s) {
        if (this.count > 0) {
            let stone;
            let rdX;
            let rdY;
            if (type == 1) {
                stone = new Stone(1);
                stone.x = 40;
                stone.y = 100

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
            // if (s == 1) {
            //     rdX = Math.floor(Math.random() * 20) + 20;
            //     rdY = Math.floor(Math.random() * 20) + 30;
            // }
            // else if (s == 2) {
            //     rdX = Math.floor(Math.random() * 20) + 20;
            //     rdY = Math.floor(Math.random() * 20) + 75;
            //
            // }
            // else
            //     {
            rdX = Math.floor((Math.random() - Math.random()) * 15) + 20;
            rdY = Math.floor((Math.random() - Math.random()) * 25) + 30;
            // }
            this.addChild(stone);
            this.count--;
            this.createStone(rdX, rdY, 0, s);
        }
    }

    checkStoneLast(arraySquare: PIXI.Container[]) {
        let count = 0;
        for (let i = 0; i < arraySquare.length; i++) {
            if (viewGame.turn == false && i > 0 && i < 6) {
                if (arraySquare[i].children.length == 0) {
                    count++;

                }
            }
            if (viewGame.turn == true && i > 6 && i < 12) {
                if (arraySquare[i].children.length == 0) {
                    count++;

                }
            }
        }
        if (count == 5) {
            this.SpeardStone(arraySquare);
            console.log("Chao dz");
        }
    }

    SpeardStone(arraySquare: PIXI.Container[]) {
        let arrayBox: PIXI.Container = <PIXI.Container>arraySquare[1].parent.parent.getChildAt(1);//12 ô
        let Box = arrayBox.children;//12 ô
        let spread = arraySquare[14];
        let oldPos;
        if (viewGame.turn == false) {
            oldPos = new PIXI.Point(arraySquare[12].position.x, arraySquare[12].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            let Stones = arraySquare[12].children;
            let n = Stones.length;
            let count = 1;
            let i = 0;
            if (n > 4) {
                while (count < 6) {
                    if ((<Stone> Stones[i]).getType() == 0) {
                        spread.addChild(Stones[i]);
                        count++;
                    }
                    else
                        i++;
                }
                count = 1;
                let Stone = spread.children
                let m = Stone.length;
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        TweenMax.to(arraySquare[14], 0.4, {x: arraySquare[count].x, y: arraySquare[count].y});
                        setTimeout(() => {
                            let box = <Box> Box[count];
                            Stone[0].position.set(35, 35);
                            arraySquare[count].addChild(Stone[0]);
                            box.setText(this.checkPoint(arraySquare[count]));
                            count++;
                            let box1 = <Box> Box[12];
                            box1.setText(this.checkPoint(arraySquare[12]) + this.checkPoint(arraySquare[14]))
                        }, 450);
                    }, 700 + 470 * i)
                }
            }
        }
        if (viewGame.turn == true) {
            oldPos = new PIXI.Point(arraySquare[13].position.x, arraySquare[13].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            let Stones = arraySquare[13].children;
            let n = Stones.length;
            let count = 1;
            let i = 0;
            if (n > 4) {
                while (count < 6) {
                    if ((<Stone> Stones[i]).getType() == 0) {
                        spread.addChild(Stones[i]);
                        count++;
                    }
                    else
                        i++;
                }
                count = 7;
                let Stone = spread.children
                let m = Stone.length;
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        TweenMax.to(arraySquare[14], 0.4, {x: arraySquare[count].x, y: arraySquare[count].y});
                        setTimeout(() => {
                            let box = <Box> Box[count];
                            Stone[0].position.set(35, 35);
                            arraySquare[count].addChild(Stone[0]);
                            box.setText(this.checkPoint(arraySquare[count]));
                            count++;
                            let box1 = <Box> Box[13];
                            box1.setText(this.checkPoint(arraySquare[13]) + this.checkPoint(arraySquare[14]))
                        }, 450);
                    }, 700 + 470 * i)
                }
            }
        }
    }

    onDragStart = (event) => {
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
        this.posx = this.x;
        this.posy = this.y;

    }
    onDragEnd = () => {
        // this.posx = this.x;
        // this.posy = this.y;
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

    onSquareTurn(arraySquare: PIXI.Container[]) {
        viewGame.turn = !viewGame.turn;
        if (!viewGame.turn) {
            for (let i = 0; i < arraySquare.length - 2; i++) {
                if (i > 0 && i < 6) {
                    arraySquare[i].interactive = true;

                }
                else {
                    arraySquare[i].interactive = false;
                }
            }
        }
        else {
            for (let i = 0; i < arraySquare.length - 3; i++) {
                if (i > 6)
                    arraySquare[i].interactive = true;
                else {
                    arraySquare[i].interactive = false;
                }

            }
        }
    }

    onCanMove = (ct: PIXI.Container) => {

        if (ct.y > this.posy - 80 && ct.y < this.posy + 80 && (ct.x < this.posx + 150 && ct.x > this.posx + 40)) {
            // this.emit("move");
            if (ct.y > 130 && viewGame.turn == false) {
                // viewGame.socket.emit("MoveRight", ct.parent.getChildIndex(ct));
                this.onMoveRight(ct);
            }
            if (ct.y < 130 && viewGame.turn == true) {
                // viewGame.socket.emit("MoveLeft", ct.parent.getChildIndex(ct));
                this.onMoveLeft(ct);
            }
            // viewGame.socket.emit('YourTurn');
            // this.onStopMove(ct);
        }
        else if (ct.y > this.posy - 80 && ct.y < this.posy + 80 && (ct.x > this.posx - 150 && ct.x < this.posx - 40)) {
            // this.emit("move");
            // ct.position.set(this.posx, this.posy);
            if (ct.y > 130 && viewGame.turn == false) {
                // viewGame.socket.emit("MoveLeft", ct.parent.getChildIndex(ct));
                this.onMoveLeft(ct);
            }
            if (ct.y < 130 && viewGame.turn == true) {
                // viewGame.socket.emit("MoveRight", ct.parent.getChildIndex(ct));
                this.onMoveRight(ct);
            }
            // viewGame.socket.emit('YourTurn');
            // / this.onStopMove(ct);
        }

        // else
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
                if (viewGame.turn == true) {
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

            v = this.pos + 1;
            if (v == 12)
                v = 0
            one = arraySquare[0].children.length;
            two = arraySquare[6].children.length;
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
            this.checkForRight(arraySquare, v, Box, ct);
            this.pos = null;

        }, n * 450 + 650);

    }

    checkForRight(arraySquare: PIXI.Container[], v, Box, ct) {
        this.onEatRight(arraySquare, Box);
        ct.position.set(this.posx, this.posy);
        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 5 && this.pos != 11) {
            this.posx = arraySquare[v].x;
            this.posy = arraySquare[v].y;
            this.onMoveRight(arraySquare[v]);
        }
        else {
            setTimeout(() => {
                this.onStartMove(arraySquare[1]);
                this.checkStoneLast(arraySquare);
                this.onSquareTurn(arraySquare);
                console.log(viewGame.turn);
                this.checkStoneLast(arraySquare);
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
                if (viewGame.turn == true) {
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
            this.checkForLeft(arraySquare, v, Box, ct);
            this.pos = null;
        }, n * 450 + 650);
    }

    checkForLeft(arraySquare: PIXI.Container[], v, Box, ct) {
        this.onEatLeft(arraySquare, Box);
        ct.position.set(this.posx, this.posy);
        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 7 && this.pos != 1) {
            this.posx = arraySquare[v].x;
            this.posy = arraySquare[v].y;
            this.onMoveLeft(arraySquare[v]);

        }
        else {
            setTimeout(() => {
                this.onStartMove(arraySquare[1]);
                this.checkStoneLast(arraySquare);
                this.onSquareTurn(arraySquare);
                console.log(viewGame.turn);
                this.checkStoneLast(arraySquare);
            }, 500);
        }
    }

    checkPoint(ct: PIXI.Container): number {
        let stone = ct.children;
        let count = 0;
        for (let i = 0; i < stone.length; i++) {
            count += (<Stone>stone[i]).getPoint();
        }
        return count;
    }
}