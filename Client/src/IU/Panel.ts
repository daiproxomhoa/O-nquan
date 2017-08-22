/**
 * Created by Administrator on 26/02/2017.
 */

import "pixi.js"
import Sprite = PIXI.Sprite;
import * as gsap from "gsap"
import TweenMax = gsap.TweenMax;
import {Button} from "./Button";
import {TextField} from "./TextField";
import Back = gsap.Back;
import {viewGame} from "../viewGame/viewGame";
import {App} from "../Const/App";


export class Panel extends Sprite {
    static panel = new Panel();

    contentPane: PIXI.Container;
    messageBox: PIXI.Container;
    buttonBox: PIXI.Container;
    textTB: PIXI.Text;

    constructor() {
        super(PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png"));
        this.anchor.set(0.5);
        this.x = 500;
        this.y = 200;
        this.width = 500;
        this.height = 300;
        this.contentPane = new PIXI.Container();
        this.addChild(this.contentPane);
        this.messageBox = new PIXI.Container();
        this.contentPane.addChild(this.messageBox);
        this.buttonBox = new PIXI.Container();
        this.buttonBox.y = 260 * 0.9;
        let text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/thongbao.png');
        text.anchor.set(0.5);
        // text.position.set(-75,-220)
        text.y = -198
        this.contentPane.addChild(text);
        this.contentPane.addChild(this.buttonBox);

    }

    static closeDialog = () => {
        TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn});
        setTimeout(() => viewGame.Game.interactiveChildren = true, 500);
    }

    static showDialog = (message: string, duration?: number) => {
        viewGame.Game.interactiveChildren = false;
        Panel.panel.texture = PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png");
        Panel.panel.scale.set(0.7);
        Panel.panel.y = -500;
        Panel.panel.x = Math.random() * 1280;
        let text;

            if (message === "Đợi đối phương trả lời") {
                text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/traloi.png');
                text.anchor.set(0.5);
                text.y = -20;
            }
            else if (message === "Không có ai trong phòng !") {
                text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/emty.png');
                text.anchor.set(0.5);
                text.y = -20;
                Panel.panel.messageBox.addChild(text);
            }
            else {
                text = new PIXI.Text(message);
                text.anchor.set(0.5);
                text.y = -20;
                text.style = new PIXI.TextStyle({
                    fontFamily: 'UTM French Vanilla',
                    fontSize: 42,
                    fontWeight: 'bold',
                    fill: '#51301b',
                    align: "center",
                    wordWrap: true,
                    wordWrapWidth: 500
                });
        }
        Panel.panel.messageBox.removeChildren();
        Panel.panel.buttonBox.removeChildren();
        Panel.panel.messageBox.addChild(text);
        Panel.panel.parent.setChildIndex(Panel.panel, Panel.panel.parent.children.length - 1);
        TweenMax.to(Panel.panel, 0.5, {
            x: 580,
            y: 320,
            ease: Back.easeOut
        });
        if (duration != -1) {
            setTimeout(() => TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn}), duration ? duration : 2000);
            setTimeout(() => viewGame.Game.interactiveChildren = true, duration ? duration * 1000 + 500 : 2500);
        }
    }

    static showMessageDialog = (message: string, action?: any) => {
        viewGame.Game.interactiveChildren = false;
        Panel.panel.texture = PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png");
        Panel.panel.scale.set(0.7);
        Panel.panel.y = -500;
        Panel.panel.x = Math.random() * 1280;
        let text;
        text = new PIXI.Text(message);
        text.anchor.set(0.5);
        text.y = -20;
        text.style = new PIXI.TextStyle({
            fontFamily: 'UTM French Vanilla',
            fontSize: 42,
            fontWeight: 'bold',
            fill: '#51301b',
            align: "center",
            wordWrap: true,
            wordWrapWidth: 500
        });
        Panel.panel.messageBox.removeChildren();
        Panel.panel.buttonBox.removeChildren();
        Panel.panel.messageBox.addChild(text);

        let button = new Button(25, -115, "OK");

        Panel.panel.buttonBox.addChild(button);
        button.onClick = () => {
            TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn});
            setTimeout(() => viewGame.Game.interactiveChildren = true, 500);
            if (action) action();
        }
        TweenMax.to(Panel.panel, 0.5, {
            x: 580,
            y: 320,
            ease: Back.easeOut
        });

        Panel.panel.parent.setChildIndex(Panel.panel, Panel.panel.parent.children.length - 1);
    }

    static showConfirmDialog(msg: string, ...buttons) {
        viewGame.Game.interactiveChildren = false;
        Panel.panel.texture = PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png");
        Panel.panel.scale.set(0.7);
        Panel.panel.y = -500;
        Panel.panel.x = Math.random() * 1280;
        let text;
            if (msg === "Bạn muốn chơi lại chứ ?") {
                text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/choilai.png');
                text.anchor.set(0.5);
                text.y = -20;
                Panel.panel.messageBox.addChild(text);
            }
            else if (msg === "Bạn muốn thoát chứ ?") {
                text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/thoatphong.png');
                text.anchor.set(0.5);
                text.y = -20;
                Panel.panel.messageBox.addChild(text);
            }
            else if (msg === "Đợi đối phương trả lời") {
                text = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/IU/doidp.png');
                text.anchor.set(0.5);
                text.y = -20;
                Panel.panel.messageBox.addChild(text);
            }

            else {
                text = new PIXI.Text(msg);
                text.anchor.set(0.5);
                text.y = -20;
                text.style = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: 42,
                    fontWeight: 'bold',
                    fill: '#51301b',
                    align: "center",
                    wordWrap: true,
                    wordWrapWidth: 500
                });
        }
        Panel.panel.messageBox.removeChildren();
        Panel.panel.buttonBox.removeChildren();
        Panel.panel.messageBox.addChild(text);
        let x = 110;
        for (let i = buttons.length - 1; i >= 0; i--) {
            let button = new Button(x, -115, buttons[i].text);
            Panel.panel.buttonBox.addChild(button);
            button.onClick = () => {
                TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn});
                setTimeout(() => viewGame.Game.interactiveChildren = true, 500);
                buttons[i].action();
            }
            x -= 210;
        }

        TweenMax.to(Panel.panel, 0.5, {
            x: 580,
            y: 320,
            ease: Back.easeOut
        });
        Panel.panel.parent.setChildIndex(Panel.panel, Panel.panel.parent.children.length - 1);
    }
}