/**
 * Created by Administrator on 26/02/2017.
 */

import "pixi.js"
import Rectangle = PIXI.Rectangle;
import {isNullOrUndefined} from "util";
import {viewGame} from "../viewGame/viewGame";
import {App} from "../Const/App";

export class TextField extends PIXI.Container {
    get keyDown(): (e) => any {
        return this._keyDown;
    }

    set keyDown(value: (e) => any) {
        this._keyDown = value;
    }

    static indexFocus = -1;
    static elements = [];
    displayText: PIXI.Text;
    displayName: PIXI.Text;
    index: number;
    text: string;

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

        TextField.elements.push(this);
        this.index = TextField.elements.length - 1;

        if (this.index == 0) {
            window.onkeydown = this._keyDown;
        }

        this.displayText = new PIXI.Text();
        this.displayText.anchor.set(0, 0.5);
        this.displayText.x = 20;
        this.displayText.style = new PIXI.TextStyle({
            fontFamily: 'Segoe UI',
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

        let contentPane = new PIXI.Container();
        let area = new PIXI.Graphics();
        area.drawRect(15, -64, 700, 128);
        contentPane.addChild(area);
        contentPane.mask = area;
        contentPane.addChild(this.displayText);
        this.addChild(contentPane);
        this.interactive = true;
        this.text = "";
        this.on("pointerdown", () => {
            if (this.getText().localeCompare('User name')==1) {
                this.setText('')
            }
            for (let i = 0; i < TextField.elements.length; i++) {
                let text = TextField.elements[i].displayText;
                if (text.text.endsWith("|")) {
                    text.text = text.text.substring(0, text.text.length - 1);
                }
            }
            TextField.indexFocus = this.index;
            TextField.elements[TextField.indexFocus].displayText.text += "|";
            console.log("NHU CC")
            // document.getElementById("textbox").focus();
        });
    }

    private _keyDown = (e) => {
        if (TextField.indexFocus != -1) {
            let textField = TextField.elements[TextField.indexFocus];
            let text = textField.text;
            if (e.which == 8 || e.which == 46) {
                text = text.substring(0, text.length - 1);
            } else if ((e.which > 47 && e.which < 123) || e.which == 32) {
                text = text + e.key;
            }
            textField.text = text;
            textField.displayText.text = text + "|";
            if (textField.displayText.width * textField.scale.x > textField.width * 0.95) {
                textField.displayText.x = (textField.width * 0.95
                    - textField.displayText.width * textField.scale.x) / textField.scale.x;
            } else {
                textField.displayText.x = 20;
            }
        }
    };

    getText = (): string => {
        return this.text;
    };
    setText = (text: string) => {
        this.displayText.text = text;
        this.text = text;
    }

    onClick: Function;
}
/**
 * Created by Vu Tien Dai on 24/07/2017.
 */
