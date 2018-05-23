import {TextField} from "../IU/TextField";
import {viewGame} from "./viewGame";
import {Button} from "../IU/Button";
import {HowlerUtils} from "../HowlerUtils";
import {App} from "../Const/App";
import {Panel} from "../IU/Panel";
import {Player} from "../Player";
import {Identity} from "../IU/Identity";
/**
 * Created by Vu Tien Dai on 01/08/2017.
 */
export class Login extends PIXI.Container {
    Connect;
    player;

    constructor(player: Player) {
        super();
        this.player = player;
        this.createLogin("","");
        viewGame.sound.play_BG("Login");
    }

    createLogin = (name,pass) => {
        this.removeChildren();
        let backgroud = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/background.jpg');
        backgroud.width = 1200;
        backgroud.height = 640;
        let txtUsername = new TextField(385, 237);
        txtUsername.setText(name);
        txtUsername.scale.set(0.4);
        let txtPassword = new TextField(385, 300);
        txtPassword.setText(pass);
        txtPassword.scale.set(0.4);
        txtUsername.onEnterPress = () => {
            this.player.emit("login", {name: txtUsername.getText(), pass: txtPassword});
            this.player.username = txtUsername.getText();
            txtUsername.setText("");
            txtPassword.setText("");
            this.player.emit("get room list");
        }
        txtUsername.onClick=()=>{
            txtUsername.setText("");
        }
        txtPassword.onClick=()=>{
            txtPassword.setText("");
        }
        let Loginbtn = new Button(435, 405, "", App.AssetDir + "Picture/IU/loginbtn.png");
        let Signup = new Button(580, 405, "", App.AssetDir + "Picture/IU/signup.png");
        Loginbtn.setSize(new PIXI.Point(100, 50));
        Signup.setSize(new PIXI.Point(100, 50));
        Loginbtn.onClick = () => {
            if (txtUsername.getText() != "") {
                this.player.emit("login", {name: txtUsername.getText(), pass:txtPassword.getText()});
                this.player.on("login_wrong",()=>{
                    Panel.showMessageDialog("Sai ten hoac pass",()=>{},false);
                })
                // txtUsername.setText("");
                // txtPassword.setText("");
            }
        };
        Signup.onClick = () => {
            this.createSignup();
        }

        this.addChild(backgroud, txtUsername, txtPassword, Loginbtn, Signup);

    }

    createSignup() {
        this.removeChildren();
        let backgroud = PIXI.Sprite.fromImage(App.AssetDir + 'Picture/background.jpg');
        backgroud.width = 1200;
        backgroud.height = 640;
        let txtUsername = new TextField(385, 237);
        txtUsername.scale.set(0.4);
        let txtPassword = new TextField(385, 300);
        txtPassword.scale.set(0.4);
        let sex = new Identity();
        sex.position.set(405, 345);
        let Signup = new Button(435,405, "", App.AssetDir + "Picture/IU/signup.png");
        Signup.setSize(new PIXI.Point(100, 50));
        let Back = new Button(580,405, "", App.AssetDir + "Picture/IU/outroom.png");
        Back.setSize(new PIXI.Point(100, 50));
        this.addChild(backgroud, txtUsername, txtPassword, Signup,Back, sex);
        Signup.onClick = () => {
            if (txtUsername.getText() != "" && txtPassword.getText() != "") {
                this.player.emit("signup", {name:txtUsername.getText(), pass:txtPassword.getText(), sex:sex.sex});
            }
            this.player.on("sign_up",(data)=>{
                if(data==true) {
                    Panel.showMessageDialog("Dang ki thanh cong",()=>{
                        this.createLogin(txtUsername.getText(),txtPassword.getText());
                    },false)
                }
                else
                    Panel.showMessageDialog("User name da ton tai",()=>{},false);
            });
        };
        Back.onClick=()=>{
            this.createLogin("","");
        }
    }
}