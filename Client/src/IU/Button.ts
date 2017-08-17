/**
 * Created by Administrator on 26/02/2017.
 */
import "pixi.js";
import Point = PIXI.Point;
import {HowlerUtils} from "../HowlerUtils";
import {App} from "../Const/App";

export class Button extends PIXI.Sprite {

    text;
    private _size: Point;

    constructor(x: number, y: number, text: string, url?: string) {
        super();
        this.on("pointerdown", () => {
            HowlerUtils.MouseClick.play();
        });
        if (url) {
            this.texture = PIXI.Texture.fromImage(url);
            this.width = 143;
            this.height = 78;
            this._size = new Point(143, 78);
        } else {
            this.texture = PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/button.png");
            this._size = new Point(150, 80);
            this.width = 150;
            this.height = 80;
        }
        this.anchor.set(0.5);
        this.x = x;
        this.y = y;

        this.interactive = true;

        if (App.IsWeb) {
            this.text = new PIXI.Text(text);
            this.text.style = new PIXI.TextStyle({
                fontFamily: 'UTM French Vanilla',
                fontSize: 24,
                fontWeight: 'bold',
                fill: '#51301b',
            });
        }
        else {
            if (text === "Có") {
                this.text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/co.png');
                this.text.scale.set(0.8);
            }
            else if (text == "Không") {
                this.text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/khong.png');
                this.text.scale.set(0.8);
            }
            else  {
                this.text = new PIXI.Text(text);
                this.text.style = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fontWeight: 'bold',
                    fill: '#51301b',
                });
            }

        }
        this.text.anchor.set(0.5);
        this.addChild(this.text);
        this.on("pointerdown", () => {
            this.width = this._size.x * 0.9;
            this.height = this._size.y * 0.9;
        })
            .on("pointerup", () => {
                if (this.onClick) this.onClick();
                this.width = this._size.x;
                this.height = this._size.y;
            })
            .on("pointerover", () => {
                this.width = this._size.x * 1.1;
                this.height = this._size.y * 1.1;
            })
            .on("pointerout", () => {
                this.width = this._size.x;
                this.height = this._size.y;
            });
    }

    setImage = (url: string, width?: number, height?: number) => {
        this.texture = PIXI.Texture.fromImage(url);
        if (width) {
            this.width = width;
            this.height = height;
            this._size = new Point(width, height);
        }
    }

    onClick: Function;


    setSize = (size: PIXI.Point) => {
        this._size = size;
        this.width = this._size.x;
        this.height = this._size.y;
    }


}
/**
 * Created by Vu Tien Dai on 24/07/2017.
 */
