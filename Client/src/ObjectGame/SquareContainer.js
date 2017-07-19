"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var gsap = require("gsap");
var TweenMax = gsap.TweenMax;
var viewGame_1 = require("../viewGame/viewGame");
var Stone_1 = require("./Stone");
/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
var Square = (function (_super) {
    __extends(Square, _super);
    function Square(count, type, index, player) {
        if (count === void 0) { count = 0; }
        var _this = _super.call(this) || this;
        _this.count = count;
        _this.maxWidth = 64;
        _this.maxHeight = 56;
        _this.minDis = 5;
        _this.pos = 1;
        _this.seq = 0;
        _this.onDragStart = function (event) {
            _this.data = event.data;
            _this.alpha = 0.5;
            _this.dragging = true;
            _this.posx = _this.x;
            _this.posy = _this.y;
        };
        _this.onDragEnd = function () {
            // this.posx = this.x;
            // this.posy = this.y;
            if (_this.data == null)
                return;
            _this.alpha = 1;
            _this.dragging = false;
            _this.data = null;
            _this.onCanMove(_this);
        };
        _this.onDragMove = function () {
            if (_this.dragging) {
                var newPosition = _this.data.getLocalPosition(_this.parent);
                _this.x = newPosition.x - 40;
                _this.y = newPosition.y - 40;
            }
        };
        _this.onStopMove = function (ct) {
            var arraySquare = ct.parent.children; //12 ô
            for (var i = 0; i < arraySquare.length; i++) {
                arraySquare[i].interactive = false;
            }
        };
        _this.onStartMove = function (ct) {
            var arraySquare = ct.parent.children; //12 ô
            for (var i = 0; i < arraySquare.length; i++) {
                arraySquare[i].interactive = true;
            }
        };
        _this.onCanMove = function (ct) {
            if (ct.y > _this.posy - 80 && ct.y < _this.posy + 80 && (ct.x < _this.posx + 150 && ct.x > _this.posx + 40)) {
                // this.emit("move");
                if (ct.y > 130 && viewGame_1.viewGame.turn == false) {
                    // viewGame.socket.emit("MoveRight", ct.parent.getChildIndex(ct));
                    _this.onMoveRight(ct);
                }
                if (ct.y < 130 && viewGame_1.viewGame.turn == true) {
                    // viewGame.socket.emit("MoveLeft", ct.parent.getChildIndex(ct));
                    _this.onMoveLeft(ct);
                }
                // viewGame.socket.emit('YourTurn');
                // this.onStopMove(ct);
            }
            else if (ct.y > _this.posy - 80 && ct.y < _this.posy + 80 && (ct.x > _this.posx - 150 && ct.x < _this.posx - 40)) {
                // this.emit("move");
                // ct.position.set(this.posx, this.posy);
                if (ct.y > 130 && viewGame_1.viewGame.turn == false) {
                    // viewGame.socket.emit("MoveLeft", ct.parent.getChildIndex(ct));
                    _this.onMoveLeft(ct);
                }
                if (ct.y < 130 && viewGame_1.viewGame.turn == true) {
                    // viewGame.socket.emit("MoveRight", ct.parent.getChildIndex(ct));
                    _this.onMoveRight(ct);
                }
                // viewGame.socket.emit('YourTurn');
                // / this.onStopMove(ct);
            }
            // else
            ct.position.set(_this.posx, _this.posy);
        };
        _this.onEatRight = function (arraySquare, Box) {
            var check;
            var one = arraySquare[0].children.length;
            var two = arraySquare[6].children.length;
            var v = _this.pos + 1;
            if (v == 12)
                v = 0;
            var _loop_1 = function () {
                _this.stop = true;
                var check_1 = false;
                if (_this.pos == 4) {
                    if (two > 4) {
                        _this.pos = 6;
                        check_1 = true;
                    }
                    else
                        return "break";
                }
                else if (_this.pos == 10) {
                    if (one > 4) {
                        _this.pos = 0;
                        check_1 = true;
                    }
                    else
                        return "break";
                }
                else if (_this.pos != 4 && _this.pos != 10) {
                    _this.pos = _this.pos + 2;
                    if (_this.pos == 13)
                        _this.pos = 1;
                    if (_this.pos == 12)
                        _this.pos = 0;
                    if (arraySquare[_this.pos].children.length == 0) {
                        return "break";
                    }
                    check_1 = true;
                }
                if (check_1 == true) {
                    var box1 = Box[_this.pos];
                    box1.setText('0');
                    var oldPos = new PIXI.Point(arraySquare[_this.pos].position.x, arraySquare[_this.pos].position.y);
                    arraySquare[14].position.set(oldPos.x, oldPos.y);
                    _this.MoveEat(arraySquare[_this.pos], arraySquare[14]);
                    if (viewGame_1.viewGame.turn == true) {
                        var square_1 = arraySquare[13];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                        setTimeout(function () {
                            _this.MoveEat(arraySquare[14], arraySquare[13]);
                            var box2 = Box[13];
                            box2.setText(_this.checkPoint(square_1));
                        }, 400);
                    }
                    else {
                        var square_2 = arraySquare[12];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                        setTimeout(function () {
                            _this.MoveEat(arraySquare[14], arraySquare[12]);
                            var box2 = Box[12];
                            box2.setText(_this.checkPoint(square_2));
                        }, 400);
                    }
                }
                v = _this.pos + 1;
                if (v == 12)
                    v = 0;
                one = arraySquare[0].children.length;
                two = arraySquare[6].children.length;
            };
            while (arraySquare[v].children.length == 0) {
                var state_1 = _loop_1();
                if (state_1 === "break")
                    break;
            }
        };
        _this.onMoveRight = function (ct) {
            _this.stop = false;
            var arraySquare = ct.parent.children; //12 ô
            var arrayBox = ct.parent.parent.getChildAt(1); //12 ô
            var Box = arrayBox.children; //12 ô
            var Stone = ct.children; //số đá trong ô hiện tại
            var j = ct.parent.getChildIndex(ct); //vị trí bắt đầu ném đá vào
            var oldPos = new PIXI.Point(ct.position.x, ct.position.y);
            var spread = arraySquare[14];
            spread.position.set(oldPos.x, oldPos.y);
            var l = Stone.length;
            for (var i = 0; i < l; i++) {
                spread.addChild(Stone[0]);
            }
            var arrayStone = spread.children;
            var n = arrayStone.length;
            Box[j].setText("0");
            _this.onStopMove(ct);
            for (var i = 0; i < n; i++) {
                setTimeout(function () {
                    j++;
                    if (j >= 12)
                        j = 0;
                    var square = arraySquare[j];
                    var box = Box[j];
                    if (j == 0) {
                        var y_1 = arrayStone[0].y + 20;
                        var x_1 = arrayStone[0].x + 5;
                        TweenMax.to(spread, 0.4, { x: 113, y: 92 });
                        setTimeout(function () {
                            arrayStone[0].position.set(x_1, y_1);
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 450);
                    }
                    else if (j == 6) {
                        var y_2 = arrayStone[0].y + 65;
                        TweenMax.to(spread, 0.4, { x: 575, y: 130 });
                        setTimeout(function () {
                            arrayStone[0].position.y = y_2;
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 450);
                    }
                    else {
                        TweenMax.to(spread, 0.4, { x: square.x, y: square.y });
                        setTimeout(function () {
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 450);
                    }
                }, i * 450 + 550);
            }
            setTimeout(function () {
                _this.pos = j;
                var v = j + 1;
                if (v == 12)
                    v = 0;
                _this.checkForRight(arraySquare, v, Box, ct);
                _this.pos = null;
            }, n * 450 + 650);
        };
        _this.onEatLeft = function (arraySquare, Box) {
            var check;
            var one = arraySquare[0].children.length;
            var two = arraySquare[6].children.length;
            var v = _this.pos - 1;
            if (v == -1)
                v = 11;
            var _loop_2 = function () {
                _this.stop = true;
                if (_this.pos == 8) {
                    if (two > 4) {
                        _this.pos = 6;
                        check = true;
                    }
                    else
                        return "break";
                }
                else if (_this.pos == 2) {
                    if (one > 4) {
                        _this.pos = 0;
                        check = true;
                    }
                    else
                        return "break";
                }
                else if (_this.pos != 2 && _this.pos != 8) {
                    _this.pos = _this.pos - 2;
                    if (_this.pos == -2)
                        _this.pos = 10;
                    if (_this.pos == -1)
                        _this.pos = 11;
                    if (arraySquare[_this.pos].children.length == 0) {
                        return "break";
                    }
                    check = true;
                }
                if (check == true) {
                    var box1 = Box[_this.pos];
                    box1.setText('0');
                    var oldPos = new PIXI.Point(arraySquare[_this.pos].position.x, arraySquare[_this.pos].position.y);
                    arraySquare[14].position.set(oldPos.x, oldPos.y);
                    _this.MoveEat(arraySquare[_this.pos], arraySquare[14]);
                    if (viewGame_1.viewGame.turn == true) {
                        var square_3 = arraySquare[13];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                        setTimeout(function () {
                            _this.MoveEat(arraySquare[14], arraySquare[13]);
                            var box2 = Box[13];
                            box2.setText(_this.checkPoint(square_3));
                        }, 400);
                    }
                    else {
                        var square_4 = arraySquare[12];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                        setTimeout(function () {
                            _this.MoveEat(arraySquare[14], arraySquare[12]);
                            var box2 = Box[12];
                            box2.setText(_this.checkPoint(square_4));
                        }, 400);
                    }
                }
                v = _this.pos - 1;
                if (v == -1)
                    v = 11;
                one = arraySquare[0].children.length;
                two = arraySquare[6].children.length;
            };
            while (arraySquare[v].children.length == 0) {
                var state_2 = _loop_2();
                if (state_2 === "break")
                    break;
            }
        };
        _this.onMoveLeft = function (ct) {
            _this.stop = false;
            var arraySquare = ct.parent.children; //12 ô
            var arrayBox = ct.parent.parent.getChildAt(1); //12 ô
            var Box = arrayBox.children; //12 ô
            var Stone = ct.children; //số đá trong ô hiện tại
            var j = ct.parent.getChildIndex(ct); //vị trí bắt đầu ném đá vào
            var oldPos = new PIXI.Point(ct.position.x, ct.position.y);
            var spread = arraySquare[14];
            spread.position.set(oldPos.x, oldPos.y);
            var l = Stone.length;
            for (var i = 0; i < l; i++) {
                spread.addChild(Stone[0]);
            }
            var arrayStone = spread.children;
            var n = arrayStone.length;
            Box[j].setText("0");
            _this.onStopMove(ct);
            for (var i = 0; i < n; i++) {
                setTimeout(function () {
                    j--;
                    if (j <= -1)
                        j = 11;
                    var square = arraySquare[j];
                    var box = Box[j];
                    if (j == 0) {
                        var y_3 = arrayStone[0].y + 20;
                        var x_2 = arrayStone[0].x + 5;
                        TweenMax.to(spread, 0.4, { x: 113, y: 92 });
                        setTimeout(function () {
                            arrayStone[0].position.set(x_2, y_3);
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 450);
                    }
                    else if (j == 6) {
                        var y_4 = arrayStone[0].y + 50;
                        TweenMax.to(spread, 0.4, { x: 575, y: 130 });
                        setTimeout(function () {
                            arrayStone[0].position.y = y_4;
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 450);
                    }
                    else {
                        TweenMax.to(spread, 0.4, { x: square.x, y: square.y });
                        setTimeout(function () {
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 450);
                    }
                }, i * 450 + 550);
                // console.log(Box);
            }
            setTimeout(function () {
                _this.pos = j;
                var v = j - 1;
                if (v == -1)
                    v = 11;
                _this.checkForLeft(arraySquare, v, Box, ct);
                _this.pos = null;
            }, n * 450 + 650);
        };
        _this.index = index;
        if (type == 1 || type == 2) {
            _this.addStone(count, type, type);
        }
        else {
            _this.addStone(count, 0, 0);
        }
        if (index != 0 && index != 6 && index != 12 && index != 13 && index != 14) {
            _this.interactive = true;
            _this.on('pointerdown', _this.onDragStart)
                .on('pointerup', _this.onDragEnd)
                .on('pointerupoutside', _this.onDragEnd)
                .on('pointermove', _this.onDragMove);
        }
        if (viewGame_1.viewGame.turn == false && _this.index > 6) {
            _this.interactive = false;
        }
        if (viewGame_1.viewGame.turn == true && _this.index > 0 && _this.index < 6) {
            _this.interactive = false;
        }
        _this.posx = _this.x;
        _this.posy = _this.y;
        return _this;
    }
    Square.prototype.addStone = function (count, type, s) {
        // this.createStone(Math.floor((Math.random() - Math.random()) * 25) + 40, Math.floor((Math.random() - Math.random()) * 25) + 40, type, s);
        this.createStone(35, 35, type, s);
    };
    Square.prototype.createStone = function (x, y, type, s) {
        if (this.count > 0) {
            var stone = void 0;
            var rdX = void 0;
            var rdY = void 0;
            if (type == 1) {
                stone = new Stone_1.Stone(1);
                stone.x = 40;
                stone.y = 100;
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
    };
    Square.prototype.checkStoneLast = function (arraySquare) {
        var count = 0;
        for (var i = 0; i < arraySquare.length; i++) {
            if (viewGame_1.viewGame.turn == false && i > 0 && i < 6) {
                if (arraySquare[i].children.length == 0) {
                    count++;
                }
            }
            if (viewGame_1.viewGame.turn == true && i > 6 && i < 12) {
                if (arraySquare[i].children.length == 0) {
                    count++;
                }
            }
        }
        if (count == 5) {
            this.SpeardStone(arraySquare);
            console.log("Chao dz");
        }
    };
    Square.prototype.SpeardStone = function (arraySquare) {
        var _this = this;
        var arrayBox = arraySquare[1].parent.parent.getChildAt(1); //12 ô
        var Box = arrayBox.children; //12 ô
        var spread = arraySquare[14];
        var oldPos;
        if (viewGame_1.viewGame.turn == false) {
            oldPos = new PIXI.Point(arraySquare[12].position.x, arraySquare[12].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            var Stones = arraySquare[12].children;
            var n = Stones.length;
            var count_1 = 1;
            var i = 0;
            if (n > 4) {
                while (count_1 < 6) {
                    if (Stones[i].getType() == 0) {
                        spread.addChild(Stones[i]);
                        count_1++;
                    }
                    else
                        i++;
                }
                count_1 = 1;
                var Stone_2 = spread.children;
                var m = Stone_2.length;
                for (var i_1 = 0; i_1 < 5; i_1++) {
                    setTimeout(function () {
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[count_1].x, y: arraySquare[count_1].y });
                        setTimeout(function () {
                            var box = Box[count_1];
                            Stone_2[0].position.set(35, 35);
                            arraySquare[count_1].addChild(Stone_2[0]);
                            box.setText(_this.checkPoint(arraySquare[count_1]));
                            count_1++;
                            var box1 = Box[12];
                            box1.setText(_this.checkPoint(arraySquare[12]) + _this.checkPoint(arraySquare[14]));
                        }, 450);
                    }, 700 + 470 * i_1);
                }
            }
        }
        if (viewGame_1.viewGame.turn == true) {
            oldPos = new PIXI.Point(arraySquare[13].position.x, arraySquare[13].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            var Stones = arraySquare[13].children;
            var n = Stones.length;
            var count_2 = 1;
            var i = 0;
            if (n > 4) {
                while (count_2 < 6) {
                    if (Stones[i].getType() == 0) {
                        spread.addChild(Stones[i]);
                        count_2++;
                    }
                    else
                        i++;
                }
                count_2 = 7;
                var Stone_3 = spread.children;
                var m = Stone_3.length;
                for (var i_2 = 0; i_2 < 5; i_2++) {
                    setTimeout(function () {
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[count_2].x, y: arraySquare[count_2].y });
                        setTimeout(function () {
                            var box = Box[count_2];
                            Stone_3[0].position.set(35, 35);
                            arraySquare[count_2].addChild(Stone_3[0]);
                            box.setText(_this.checkPoint(arraySquare[count_2]));
                            count_2++;
                            var box1 = Box[13];
                            box1.setText(_this.checkPoint(arraySquare[13]) + _this.checkPoint(arraySquare[14]));
                        }, 450);
                    }, 700 + 470 * i_2);
                }
            }
        }
    };
    Square.prototype.onSquareTurn = function (arraySquare) {
        viewGame_1.viewGame.turn = !viewGame_1.viewGame.turn;
        if (!viewGame_1.viewGame.turn) {
            for (var i = 0; i < arraySquare.length - 2; i++) {
                if (i > 0 && i < 6) {
                    arraySquare[i].interactive = true;
                }
                else {
                    arraySquare[i].interactive = false;
                }
            }
        }
        else {
            for (var i = 0; i < arraySquare.length - 3; i++) {
                if (i > 6)
                    arraySquare[i].interactive = true;
                else {
                    arraySquare[i].interactive = false;
                }
            }
        }
    };
    Square.prototype.MoveEat = function (ct1, ct2) {
        var n = ct1.children.length;
        for (var i = 0; i < n; i++) {
            if (ct1.children[0].x > 60 || ct1.children[0].y > 60)
                ct1.children[0].position.set(Math.random() * 45, Math.random() * 45);
            ct2.addChild(ct1.children[0]);
        }
    };
    Square.prototype.checkForRight = function (arraySquare, v, Box, ct) {
        var _this = this;
        this.onEatRight(arraySquare, Box);
        ct.position.set(this.posx, this.posy);
        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 5 && this.pos != 11) {
            this.posx = arraySquare[v].x;
            this.posy = arraySquare[v].y;
            this.onMoveRight(arraySquare[v]);
        }
        else {
            setTimeout(function () {
                _this.onStartMove(arraySquare[1]);
                _this.checkStoneLast(arraySquare);
                _this.onSquareTurn(arraySquare);
                console.log(viewGame_1.viewGame.turn);
                _this.checkStoneLast(arraySquare);
            }, 500);
        }
    };
    Square.prototype.checkForLeft = function (arraySquare, v, Box, ct) {
        var _this = this;
        this.onEatLeft(arraySquare, Box);
        ct.position.set(this.posx, this.posy);
        if (this.stop == false && this.pos != 0 && this.pos != 6 && this.pos != 7 && this.pos != 1) {
            this.posx = arraySquare[v].x;
            this.posy = arraySquare[v].y;
            this.onMoveLeft(arraySquare[v]);
        }
        else {
            setTimeout(function () {
                _this.onStartMove(arraySquare[1]);
                _this.checkStoneLast(arraySquare);
                _this.onSquareTurn(arraySquare);
                console.log(viewGame_1.viewGame.turn);
                _this.checkStoneLast(arraySquare);
            }, 500);
        }
    };
    Square.prototype.checkPoint = function (ct) {
        var stone = ct.children;
        var count = 0;
        for (var i = 0; i < stone.length; i++) {
            count += stone[i].getPoint();
        }
        return count;
    };
    return Square;
}(Container));
exports.Square = Square;
//# sourceMappingURL=SquareContainer.js.map