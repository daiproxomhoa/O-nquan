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
var HowlerUtils_1 = require("../HowlerUtils");
var Game_1 = require("../viewGame/Game");
/**
 * Created by Vu Tien Dai on 21/06/2017.
 */
var Square = (function (_super) {
    __extends(Square, _super);
    function Square(count, type, index, ct) {
        if (count === void 0) { count = 0; }
        var _this = _super.call(this) || this;
        _this.count = count;
        _this.maxWidth = 64;
        _this.maxHeight = 56;
        _this.minDis = 5;
        _this.pos = 1;
        _this.seq = 0;
        _this.player = viewGame_1.viewGame.player;
        _this.timeout = 0;
        _this.Seq_Eat = false;
        _this.Poit = 0;
        _this.onDragStart = function (event) {
            _this.data = event.data;
            _this.alpha = 0.5;
            _this.dragging = true;
            _this.posx = _this.x;
            _this.posy = _this.y;
            _this.scale.set(1.1);
        };
        _this.onDragEnd = function () {
            _this.scale.set(1);
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
        _this.onStartMove = function (ct) {
            var arraySquare = ct.parent.children; //12 ô
            arraySquare[0].parent.interactiveChildren = true;
        };
        _this.onCanMove = function (ct) {
            var arraySquare = ct.parent.children; //12 ô
            if (ct.y > _this.posy - 80 && ct.y < _this.posy + 80 && (ct.x < _this.posx + 150 && ct.x > _this.posx + 40)) {
                _this.player.emit("move", { posi: _this.index + 6, dr: false });
                _this.ct.clock.stop();
                _this.onMoveRight(ct);
            }
            else if (ct.y > _this.posy - 80 && ct.y < _this.posy + 80 && (ct.x > _this.posx - 150 && ct.x < _this.posx - 40)) {
                _this.player.emit("move", { posi: _this.index + 6, dr: true });
                _this.ct.clock.stop();
                _this.onMoveLeft(ct);
            }
            ct.position.set(_this.posx, _this.posy);
        };
        _this.onEatRight = function (arraySquare, Box, v) {
            var check;
            var one = arraySquare[0].children.length;
            var two = arraySquare[6].children.length;
            if (arraySquare[v].children.length == 0) {
                _this.stop = true;
                var check_1 = false;
                if (_this.pos == 4) {
                    if (two > 4) {
                        _this.pos = 6;
                        check_1 = true;
                    }
                    else {
                        _this.checkForRight(arraySquare, Box, v);
                        return;
                    }
                }
                else if (_this.pos == 10) {
                    if (one > 4) {
                        _this.pos = 0;
                        check_1 = true;
                    }
                    else {
                        _this.checkForRight(arraySquare, Box, v);
                        return;
                    }
                }
                else if (_this.pos != 4 && _this.pos != 10) {
                    _this.pos = _this.pos + 2;
                    if (_this.pos == 13)
                        _this.pos = 1;
                    if (_this.pos == 12)
                        _this.pos = 0;
                    if (arraySquare[_this.pos].children.length == 0) {
                        _this.checkForRight(arraySquare, Box, v);
                        return;
                    }
                    check_1 = true;
                }
                if (check_1 == true) {
                    var box1 = Box[_this.pos];
                    box1.setText('0');
                    var oldPos = new PIXI.Point(arraySquare[_this.pos].position.x, arraySquare[_this.pos].position.y);
                    arraySquare[14].position.set(oldPos.x, oldPos.y);
                    _this.MoveEat(arraySquare[_this.pos], arraySquare[14]);
                    if (viewGame_1.viewGame.turn != viewGame_1.viewGame.game_turn) {
                        var square_1 = arraySquare[13];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                        setTimeout(function () {
                            if (_this.pos == 0 || _this.pos == 6 && _this.Seq_Eat == false) {
                                if (_this.checkPoint(arraySquare[14]) < 18)
                                    HowlerUtils_1.HowlerUtils.AnQuan.play();
                                else
                                    HowlerUtils_1.HowlerUtils.TrungLon.play();
                            }
                            else if (_this.Seq_Eat == false && _this.pos != 0 && _this.pos != 6)
                                HowlerUtils_1.HowlerUtils.An.play();
                            _this.MoveEat(arraySquare[14], arraySquare[13]);
                            var box2 = Box[13];
                            box2.setText(_this.checkPoint(square_1));
                            _this.Seq_Eat = true;
                        }, 400);
                    }
                    else {
                        var square_2 = arraySquare[12];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                        setTimeout(function () {
                            if (_this.pos == 0 || _this.pos == 6 && _this.Seq_Eat == false) {
                                if (_this.checkPoint(arraySquare[14]) < 18)
                                    HowlerUtils_1.HowlerUtils.AnQuan.play();
                                else
                                    HowlerUtils_1.HowlerUtils.TrungLon.play();
                            }
                            else if (_this.Seq_Eat == false && _this.pos != 0 && _this.pos != 6)
                                HowlerUtils_1.HowlerUtils.An.play();
                            _this.MoveEat(arraySquare[14], arraySquare[12]);
                            var box2 = Box[12];
                            box2.setText(_this.checkPoint(square_2));
                            _this.Seq_Eat = true;
                        }, 400);
                    }
                    v = _this.pos + 1;
                    if (v == 12)
                        v = 0;
                    setTimeout(function () {
                        _this.onEatRight(arraySquare, Box, v);
                    }, 400);
                }
                else {
                    _this.checkForRight(arraySquare, Box, v);
                }
            }
            else {
                _this.checkForRight(arraySquare, Box, v);
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
                            HowlerUtils_1.HowlerUtils.Stone.play();
                            arrayStone[0].position.set(x_1, y_1);
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 400);
                    }
                    else if (j == 6) {
                        var y_2 = arrayStone[0].y + 65;
                        TweenMax.to(spread, 0.4, { x: 575, y: 130 });
                        setTimeout(function () {
                            HowlerUtils_1.HowlerUtils.Stone.play();
                            arrayStone[0].position.y = y_2;
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 400);
                    }
                    else {
                        TweenMax.to(spread, 0.4, { x: square.x, y: square.y });
                        setTimeout(function () {
                            HowlerUtils_1.HowlerUtils.Stone.play();
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 400);
                    }
                }, i * 450);
            }
            setTimeout(function () {
                _this.pos = j;
                var v = j + 1;
                if (v == 12)
                    v = 0;
                _this.onEatRight(arraySquare, Box, v);
            }, n * 450);
        };
        _this.onEatLeft = function (arraySquare, Box, v) {
            var check;
            var one = arraySquare[0].children.length;
            var two = arraySquare[6].children.length;
            if (arraySquare[v].children.length == 0) {
                _this.stop = true;
                if (_this.pos == 8) {
                    if (two > 4) {
                        _this.pos = 6;
                        check = true;
                    }
                    else {
                        _this.checkForLeft(arraySquare, Box, v);
                        return;
                    }
                }
                else if (_this.pos == 2) {
                    if (one > 4) {
                        _this.pos = 0;
                        check = true;
                    }
                    else {
                        _this.checkForLeft(arraySquare, Box, v);
                        return;
                    }
                }
                else if (_this.pos != 2 && _this.pos != 8) {
                    _this.pos = _this.pos - 2;
                    if (_this.pos == -2)
                        _this.pos = 10;
                    if (_this.pos == -1)
                        _this.pos = 11;
                    if (arraySquare[_this.pos].children.length == 0) {
                        _this.checkForLeft(arraySquare, Box, v);
                        return;
                    }
                    check = true;
                }
                if (check == true) {
                    var box1 = Box[_this.pos];
                    box1.setText('0');
                    var oldPos = new PIXI.Point(arraySquare[_this.pos].position.x, arraySquare[_this.pos].position.y);
                    arraySquare[14].position.set(oldPos.x, oldPos.y);
                    _this.MoveEat(arraySquare[_this.pos], arraySquare[14]);
                    if (viewGame_1.viewGame.turn != viewGame_1.viewGame.game_turn) {
                        var square_3 = arraySquare[13];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                        setTimeout(function () {
                            if (_this.pos == 0 || _this.pos == 6 && _this.Seq_Eat == false) {
                                if (_this.checkPoint(arraySquare[14]) < 18)
                                    HowlerUtils_1.HowlerUtils.AnQuan.play();
                                else
                                    HowlerUtils_1.HowlerUtils.TrungLon.play();
                            }
                            else if (_this.Seq_Eat == false && _this.pos != 0 && _this.pos != 6)
                                HowlerUtils_1.HowlerUtils.An.play();
                            _this.MoveEat(arraySquare[14], arraySquare[13]);
                            var box2 = Box[13];
                            box2.setText(_this.checkPoint(square_3));
                            _this.Seq_Eat = true;
                        }, 400);
                    }
                    else {
                        var square_4 = arraySquare[12];
                        TweenMax.to(arraySquare[14], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                        setTimeout(function () {
                            if (_this.pos == 0 || _this.pos == 6 && _this.Seq_Eat == false) {
                                if (_this.checkPoint(arraySquare[14]) < 18)
                                    HowlerUtils_1.HowlerUtils.AnQuan.play();
                                else
                                    HowlerUtils_1.HowlerUtils.TrungLon.play();
                            }
                            else if (_this.Seq_Eat == false && _this.pos != 0 && _this.pos != 6)
                                HowlerUtils_1.HowlerUtils.An.play();
                            _this.MoveEat(arraySquare[14], arraySquare[12]);
                            var box2 = Box[12];
                            box2.setText(_this.checkPoint(square_4));
                            _this.Seq_Eat = true;
                        }, 400);
                    }
                    v = _this.pos - 1;
                    if (v == -1)
                        v = 11;
                    setTimeout(function () {
                        _this.onEatLeft(arraySquare, Box, v);
                    }, 400);
                }
                else {
                    _this.checkForLeft(arraySquare, Box, v);
                }
            }
            else
                _this.checkForLeft(arraySquare, Box, v);
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
                            HowlerUtils_1.HowlerUtils.Stone.play();
                            arrayStone[0].position.set(x_2, y_3);
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 400);
                    }
                    else if (j == 6) {
                        var y_4 = arrayStone[0].y + 50;
                        TweenMax.to(spread, 0.4, { x: 575, y: 130 });
                        setTimeout(function () {
                            HowlerUtils_1.HowlerUtils.Stone.play();
                            arrayStone[0].position.y = y_4;
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 400);
                    }
                    else {
                        TweenMax.to(spread, 0.4, { x: square.x, y: square.y });
                        setTimeout(function () {
                            HowlerUtils_1.HowlerUtils.Stone.play();
                            square.addChild(arrayStone[0]);
                            box.setText(_this.checkPoint(square));
                        }, 400);
                    }
                }, i * 450);
            }
            setTimeout(function () {
                _this.pos = j;
                var v = j - 1;
                if (v == -1)
                    v = 11;
                _this.onEatLeft(arraySquare, Box, v);
            }, n * 450);
        };
        _this.ct = ct;
        _this.index = index;
        if (type == 1 || type == 2) {
            _this.addStone(count, type, type);
        }
        else {
            _this.addStone(count, 0, 0);
        }
        if (index > 0 && index < 6) {
            _this.interactive = true;
            _this.on('pointerdown', _this.onDragStart)
                .on('pointerup', _this.onDragEnd)
                .on('pointerupoutside', _this.onDragEnd)
                .on('pointermove', _this.onDragMove)
                .on("pointerover", function () {
                _this.scale.set(1.1);
            })
                .on("pointerout", function () {
                _this.scale.set(1);
            })
                .on("finish move", function () {
                if (viewGame_1.viewGame.turn == viewGame_1.viewGame.game_turn)
                    viewGame_1.viewGame.player.emit("change turn");
            });
        }
        return _this;
    }
    Square.prototype.addStone = function (count, type, s) {
        this.createStone(35, 35, type, s);
    };
    Square.prototype.setPos = function (x, y) {
        this.posx = x;
        this.posy = y;
    };
    Square.prototype.rePos = function () {
        this.position.set(this.posx, this.posy);
    };
    Square.prototype.createStone = function (x, y, type, s) {
        if (this.count > 0) {
            var stone = void 0;
            var rdX = void 0;
            var rdY = void 0;
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
    };
    Square.prototype.checkStoneLast = function (arraySquare) {
        var team1 = 0;
        var team2 = 0;
        for (var i = 0; i < arraySquare.length; i++) {
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
    };
    Square.prototype.SpeardStone = function (arraySquare, team) {
        var _this = this;
        var arrayBox = arraySquare[1].parent.parent.getChildAt(1); //12 ô
        var Box = arrayBox.children; //12 ô
        var spread = arraySquare[14];
        var oldPos;
        if (team == 1) {
            oldPos = new PIXI.Point(arraySquare[12].position.x, arraySquare[12].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            var Square_1 = arraySquare[12].children;
            var n = Square_1.length;
            var count_1 = 0;
            var isExist = false;
            for (var i = 0; i < n; i++) {
                var x = Square_1[i].getType;
                if (x == 0) {
                    Square_1[i].position.set(35, 35);
                    spread.addChild(Square_1[i]);
                    i--;
                    count_1++;
                }
                else
                    isExist = true;
                if (count_1 == 5)
                    break;
                if (isExist == false && count_1 == n)
                    break;
                if (isExist == true && count_1 == n - 1)
                    break;
            }
            var Stone_2 = spread.children;
            var m = Stone_2.length;
            count_1 = 1;
            if (m == 0) {
                viewGame_1.viewGame.player.emit("end game", { team: viewGame_1.viewGame.game_turn, result: 3 });
            }
            for (var i = 0; i < m; i++) {
                setTimeout(function () {
                    TweenMax.to(spread, 0.4, { x: arraySquare[count_1].x, y: arraySquare[count_1].y });
                    setTimeout(function () {
                        var box = Box[count_1];
                        HowlerUtils_1.HowlerUtils.Stone.play();
                        arraySquare[count_1].addChild(Stone_2[0]);
                        box.setText(_this.checkPoint(arraySquare[count_1]));
                        count_1++;
                        var box1 = Box[12];
                        box1.setText(_this.checkPoint(arraySquare[12]) + _this.checkPoint(spread));
                    }, 420);
                }, 450 * i);
            }
        }
        if (team == 2) {
            oldPos = new PIXI.Point(arraySquare[13].position.x, arraySquare[13].position.y);
            spread.position.set(oldPos.x, oldPos.y);
            var Square_2 = arraySquare[13].children;
            var n = Square_2.length;
            var count_2 = 0;
            var isExist = false;
            for (var i = 0; i < n; i++) {
                var x = Square_2[i].getType;
                if (x == 0) {
                    Square_2[i].position.set(35, 35);
                    spread.addChild(Square_2[i]);
                    i--;
                    count_2++;
                }
                else
                    isExist = true;
                if (count_2 == 5)
                    break;
                if (isExist == false && count_2 == n)
                    break;
                if (isExist == true && count_2 == n - 1)
                    break;
            }
            count_2 = 7;
            var Stone_3 = spread.children;
            var m = Stone_3.length;
            for (var i = 0; i < m; i++) {
                setTimeout(function () {
                    TweenMax.to(spread, 0.4, { x: arraySquare[count_2].x, y: arraySquare[count_2].y });
                    setTimeout(function () {
                        var box = Box[count_2];
                        HowlerUtils_1.HowlerUtils.Stone.play();
                        arraySquare[count_2].addChild(Stone_3[0]);
                        box.setText(_this.checkPoint(arraySquare[count_2]));
                        count_2++;
                        var box1 = Box[13];
                        box1.setText(_this.checkPoint(arraySquare[13]) + _this.checkPoint(spread));
                    }, 420);
                }, 450 * i);
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
    Square.prototype.checkForRight = function (arraySquare, Box, v) {
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
            this.emit("finish move");
        }
    };
    Square.prototype.checkForLeft = function (arraySquare, Box, v) {
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
            this.emit("finish move");
        }
    };
    Square.prototype.checkPoint = function (ct) {
        var stone = ct.children;
        var count = 0;
        for (var i = 0; i < stone.length; i++) {
            count += stone[i].getPoint;
        }
        return count;
    };
    Square.prototype.checkEndGame = function (arraySquare, Box) {
        var Stone1 = arraySquare[12].children;
        var n1 = Stone1.length;
        var count = 0;
        for (var i = 0; i < n1; i++) {
            if (Stone1[i].getType != 0)
                count++;
        }
        var Stone2 = arraySquare[13].children;
        var n2 = Stone2.length;
        for (var i = 0; i < n2; i++) {
            if (Stone2[i].getType != 0)
                count++;
        }
        if (count == 2) {
            setTimeout(function () {
                if (Math.random() * 2 > 1)
                    HowlerUtils_1.HowlerUtils.TQKV.play();
                else
                    HowlerUtils_1.HowlerUtils.TQBR.play();
            }, 1000);
            Game_1.Game.endgame = true;
            this.countPoit(arraySquare, Box);
        }
    };
    Square.prototype.countPoit = function (arraySquare, Box) {
        var _this = this;
        var _loop_1 = function (i) {
            setTimeout(function () {
                var home1 = Box[12];
                var home2 = Box[13];
                TweenMax.to(arraySquare[i], 0.4, { x: arraySquare[12].x, y: arraySquare[12].y });
                setTimeout(function () {
                    var box = Box[i];
                    var oldPos = new PIXI.Point(arraySquare[i].x, arraySquare[i].y);
                    _this.MoveEat(arraySquare[i], arraySquare[12]);
                    arraySquare[i].position.set(oldPos.x, oldPos.y);
                    box.setText(_this.checkPoint(arraySquare[i]));
                    home1.setText(_this.checkPoint(arraySquare[12]));
                }, 400);
                TweenMax.to(arraySquare[i + 6], 0.4, { x: arraySquare[13].x, y: arraySquare[13].y });
                setTimeout(function () {
                    var box = Box[i + 6];
                    var oldPos = new PIXI.Point(arraySquare[i + 6].x, arraySquare[i + 6].y);
                    _this.MoveEat(arraySquare[i + 6], arraySquare[13]);
                    arraySquare[i].position.set(oldPos.x, oldPos.y);
                    box.setText(_this.checkPoint(arraySquare[i + 6]));
                    home2.setText(_this.checkPoint(arraySquare[13]));
                }, 400);
            }, (i + 1) * 420);
        };
        for (var i = 0; i < 6; i++) {
            _loop_1(i);
        }
        var count1;
        var count2;
        setTimeout(function () {
            count1 = _this.checkPoint(arraySquare[12]);
            count2 = _this.checkPoint(arraySquare[13]);
            if (viewGame_1.viewGame.turn == viewGame_1.viewGame.game_turn) {
                if (count1 > count2)
                    viewGame_1.viewGame.player.emit("end game", { team: viewGame_1.viewGame.game_turn, result: 1, src: count1 - count2 });
                else if (count1 < count2)
                    viewGame_1.viewGame.player.emit("end game", { team: viewGame_1.viewGame.game_turn, result: 3, src: count2 - count1 });
                else
                    viewGame_1.viewGame.player.emit("end game", { team: viewGame_1.viewGame.game_turn, result: 2, src: count1 - count2 });
            }
        }, 6 * 450);
    };
    return Square;
}(Container));
exports.Square = Square;
//# sourceMappingURL=SquareContainer.js.map