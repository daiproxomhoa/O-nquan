// /**
//  * Created by Administrator on 26/02/2017.
//  */
//
// import "pixi.js"
// import Sprite = PIXI.Sprite;
// import * as gsap from "gsap"
// import TweenMax = gsap.TweenMax;
// import {Button} from "./Button";
// import {TextField} from "./TextField";
// import Back = gsap.Back;
// import {viewGame} from "../viewGame/viewGame";
//
//
// export class Panel extends Sprite {
//     static panel = new Panel();
//
//     contentPane: PIXI.Container;
//     messageBox: PIXI.Container;
//     buttonBox: PIXI.Container;
//
//     constructor() {
//         super(PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png"));
//         this.anchor.set(0.5);
//         this.x = 500;
//         this.y = 200;
//         this.width = 500;
//         this.height = 300;
//         this.contentPane = new PIXI.Container();
//         this.addChild(this.contentPane);
//         this.messageBox = new PIXI.Container();
//         this.contentPane.addChild(this.messageBox);
//         this.buttonBox = new PIXI.Container();
//         this.buttonBox.y = 260 * 0.9;
//         this.contentPane.addChild(this.buttonBox);
//     }
//
//     static closeDialog = () => {
//         TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn});
//         setTimeout(() => viewGame.gameContainer.interactiveChildren = true, 500);
//     }
//
//     static showDialog = (message: string, duration?: number) => {
//         viewGame.gameContainer.interactiveChildren = false;
//         Panel.panel.texture = PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png");
//         Panel.panel.scale.set(0.7);
//         Panel.panel.y = -500;
//         Panel.panel.x = Math.random() * 1280;
//         let text = new PIXI.Text(message);
//         text.anchor.set(0.5);
//         text.y = -20;
//         text.style = new PIXI.TextStyle({
//             fontFamily: '.VnCooper',
//             fontSize: 42,
//             fontWeight: 'bold',
//             fill: '#aa3a00',
//             align: "center",
//             wordWrap: true,
//             wordWrapWidth: 500
//         });
//         Panel.panel.messageBox.removeChildren();
//         Panel.panel.buttonBox.removeChildren();
//         Panel.panel.messageBox.addChild(text);
//         Panel.panel.parent.setChildIndex(Panel.panel, Panel.panel.parent.children.length - 1);
//         TweenMax.to(Panel.panel, 0.5, {
//             x: 640,
//             y: 384,
//             ease: Back.easeOut
//         });
//         if (duration != -1) {
//             setTimeout(() => TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn}), duration ? duration : 2000);
//             setTimeout(() => viewGame.gameContainer.interactiveChildren = true, duration ? duration * 1000 + 500 : 2500);
//         }
//     }
//
//     static showMessageDialog = (message: string, action?: any) => {
//         viewGame.gameContainer.interactiveChildren = false;
//         Panel.panel.texture = PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png");
//         Panel.panel.scale.set(0.7);
//         Panel.panel.y = -500;
//         Panel.panel.x = Math.random() * 1280;
//         let text = new PIXI.Text(message);
//         text.anchor.set(0.5);
//         text.y = -20;
//         text.style = new PIXI.TextStyle({
//             fontFamily: '.VnCooper',
//             fontSize: 42,
//             fontWeight: 'bold',
//             fill: '#622500',
//             align: "center",
//             wordWrap: true,
//             wordWrapWidth: 500
//         });
//         Panel.panel.messageBox.removeChildren();
//         Panel.panel.buttonBox.removeChildren();
//         Panel.panel.messageBox.addChild(text);
//         let button = new Button(190, -115, "OK");
//
//         Panel.panel.buttonBox.addChild(button);
//         button.onClick = () => {
//             TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn});
//             setTimeout(() => viewGame.gameContainer.interactiveChildren = true, 500);
//             if (action) action();
//         }
//         TweenMax.to(Panel.panel, 0.5, {
//             x: 640,
//             y: 384,
//             ease: Back.easeOut
//         });
//
//
//         Panel.panel.parent.setChildIndex(Panel.panel, Panel.panel.parent.children.length - 1);
//     }
//
//     static showConfirmDialog(msg: string, ...buttons) {
//         viewGame.gameContainer.interactiveChildren = false;
//         Panel.panel.texture = PIXI.Texture.fromImage(App.AssetDir + "Picture/IU/panel.png");
//         Panel.panel.scale.set(0.7);
//         Panel.panel.y = -500;
//         Panel.panel.x = Math.random() * 1280;
//         let text = new PIXI.Text(msg);
//         text.anchor.set(0.5);
//         text.y = -20;
//         text.style = new PIXI.TextStyle({
//             fontFamily: '.VnCooper',
//             fontSize: 42,
//             align: "center",
//             fontWeight: 'bold',
//             fill: '#622500',
//             wordWrap: true,
//             wordWrapWidth: 500
//         });
//         Panel.panel.messageBox.removeChildren();
//         Panel.panel.buttonBox.removeChildren();
//         Panel.panel.messageBox.addChild(text);
//         let x = 200;
//         for (let i = buttons.length - 1; i >= 0; i--) {
//             let button = new Button(x, -115, buttons[i].text);
//             Panel.panel.buttonBox.addChild(button);
//             button.onClick = () => {
//                 TweenMax.to(Panel.panel, 0.5, {y: -500, ease: Back.easeIn});
//                 setTimeout(() => viewGame.gameContainer.interactiveChildren = true, 500);
//                 buttons[i].action();
//             }
//             x -= 170;
//         }
//
//         TweenMax.to(Panel.panel, 0.5, {
//             x: 640,
//             y: 384,
//             ease: Back.easeOut
//         });
//         Panel.panel.parent.setChildIndex(Panel.panel, Panel.panel.parent.children.length - 1);
//     }
// }