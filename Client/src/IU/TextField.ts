/**
 * Created by Vu Tien Dai on 20/08/2017.
 */
/**
 * Created by Administrator on 26/02/2017.
 */

import "pixi.js"
import Rectangle = PIXI.Rectangle;
import * as Input from "./TextInput";
import {App} from "../Const/App";
export class TextField extends PIXI.Container {

    displayName: PIXI.Text;
    private input;
    private style;
    _index;

    constructor(x: number, y: number, public size: number = 1, name?: string) {

        super();

        let base = PIXI.BaseTexture.fromImage(App.AssetDir + "Picture/IU/textfield.png");
        let left = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(0, 0, 50, 127)));
        left.anchor.set(0, 0.5);
        let center = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(50, 0, 650, 127)));
        center.anchor.set(0, 0.5);
        let right = new PIXI.Sprite(new PIXI.Texture(base, new Rectangle(700, 0, 41, 127)));
        right.anchor.set(0, 0.5);

        this.addChild(left);
        this.addChild(center);
        center.width = center.width * size;
        center.x = 50;
        this.addChild(right);
        right.x = 50 + center.width;

        this.style = new PIXI.TextStyle({
            fontFamily: 'Segoe ui',
            fontSize: 42,
            fill: '#ffffff',
        });
        if (name) {
            this.displayName = new PIXI.Text(name);
            this.displayName.style = new PIXI.TextStyle({
                fontFamily: 'Myriad Pro Bold',
                fontSize: 52,
                fontWeight: 'bold',
                fill: '#613012',
            });
            this.displayName.y = -120;
            this.addChild(this.displayName);
        }

        this.x = x;
        this.y = y;

        this.x = x;
        this.y = y;
        this.style = new PIXI.TextStyle({
            fontFamily: 'Segoe ui',
            fontSize: 48,
            fill: '#ffffff',
        });

        this.input = new Input.PixiTextInput("", this.style);
        this.input.background = false;
        this.input.width = center.width;
        this.input.caretColor = 0xffffff;
        this.input.x = 20;
        this.input.y = -this.input.height / 2;
        this.addChild(this.input);
    }
    focus = () => {
        this.input.focus();
    };

    blur = () => {
        this.input.blur();
    }

    set onEnterPress(fn: Function) {
        this.input.onEnterPress = fn;
    }
    onClick: Function;
    getText = (): string => {
        return this.input.text;
    };
    setText = (text: string) => {
        this.input.setText(text);
    }
}