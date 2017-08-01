import {TextField} from "../IU/TextField";
import {viewGame} from "./viewGame";
import {Button} from "../IU/Button";
/**
 * Created by Vu Tien Dai on 01/08/2017.
 */
export class Login extends PIXI.Container {
    constructor() {
        super();
        this.createLogin();
    }

    createLogin = () => {
        let backgroud = PIXI.Sprite.fromImage('../Picture/Login.png');
        backgroud.width = 1200;
        backgroud.height = 640;
        let txtMessage = new TextField(145, 400);
        txtMessage.setText('User name ');
        txtMessage.scale.set(0.4);
        let Loginbtn = new Button(510, 400, "", "../Picture/IU/loginbtn.png");
        Loginbtn.setSize(new PIXI.Point(100, 50));
        Loginbtn.onClick = () => {
            if (txtMessage.getText() != "") {
                viewGame.player.emit("login", txtMessage.getText());
                txtMessage.setText("");
                this.alpha = 0;
                this.visible=false;
            }
        };
        this.addChild(backgroud, txtMessage, Loginbtn)
    }
}