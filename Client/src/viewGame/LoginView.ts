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
    private Connect;

    constructor() {
        super();
        this.createLogin();
        HowlerUtils.Login.play();
    }

    createLogin = () => {
        let backgroud = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/background.jpg');
        backgroud.width = 1200;
        backgroud.height = 640;
        let txtMessage = new TextField(145, 400);
        txtMessage.setText('User name');
        txtMessage.scale.set(0.4);
        let Loginbtn = new Button(510, 400, "", App.AssetDir + "Picture/IU/loginbtn.png");
        Loginbtn.setSize(new PIXI.Point(100, 50));
        Loginbtn.onClick = () => {
            if (txtMessage.getText() != "") {
                viewGame.player.username = txtMessage.getText();
                viewGame.player.emit("login", txtMessage.getText());
                viewGame.player.emit("join room now")
                txtMessage.setText("");

                if (App.IsWeb) {
                    viewGame.player.on("join room success", () => {
                        this.visible = false;
                        viewGame.Game.visible = true;
                        HowlerUtils.Login.stop();
                        clearTimeout(this.Connect);

                    });
                    this.Connect = setTimeout(() => {
                        Panel.showConfirmDialog("Can't connect to sever...", {
                            text: "Cancel",
                            action: () => {

                            }
                        }, {
                            text: "Retry",
                            action: () => {
                                viewGame.player = new Player();
                                viewGame.player.emit("login", txtMessage.getText());
                                viewGame.player.emit("join room now")
                            }
                        });
                    }, 2500);
                }
                else {
                    this.visible = false;
                    viewGame.Game.visible = true;
                    HowlerUtils.Login.stop();
                    clearTimeout(this.Connect);
                }
            }


        };

        this.addChild(backgroud, txtMessage, Loginbtn)

    }
}