import {TextField} from "../IU/TextField";
import {viewGame} from "./viewGame";
import {Button} from "../IU/Button";
import {HowlerUtils} from "../HowlerUtils";
import {App} from "../Const/App";
import {Panel} from "../IU/Panel";
import {Player} from "../Player";
/**
 * Created by Vu Tien Dai on 01/08/2017.
 */
export class Login extends PIXI.Container {
    Connect;
    txtMessage;

    constructor() {
        super();
        this.createLogin();
        viewGame.sound.play_BG("Login");
    }

    createLogin = () => {
        let backgroud = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/background.jpg');
        backgroud.width = 1200;
        backgroud.height = 640;
        this.txtMessage = new TextField(385, 400);
        this.txtMessage.setText('User name'+Math.floor(Math.random()*1000));
        this.txtMessage.scale.set(0.4);
        let Loginbtn = new Button(750, 400, "", App.AssetDir + "Picture/IU/loginbtn.png");
        Loginbtn.setSize(new PIXI.Point(100, 50));
        Loginbtn.onClick = () => {
            if (this.txtMessage.getText() != "") {
                viewGame.player.username = this.txtMessage.getText();
                viewGame.player.emit("login", this.txtMessage.getText());
                viewGame.player.username=this.txtMessage.getText();
                this.txtMessage.setText("");
                viewGame.player.emit("get room list");
                this.Connect = setTimeout(() => {
                   Panel.showMessageDialog("Can not connecting to server @@! ...")
                }, 2500);
            }
        };

        this.addChild(backgroud, this.txtMessage, Loginbtn)

    }
}