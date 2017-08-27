import {ScrollPane} from "../IU/ScollPane";
import {TextField} from "../IU/TextField";
import {Button} from "../IU/Button";
import {viewGame} from "./viewGame";
import {App} from "../Const/App";
/**
 * Created by Vu Tien Dai on 01/08/2017.
 */
export class Chat extends PIXI.Container {

    messageBox: ScrollPane;

    constructor() {
        super();
        this.createChat();
    }

    createChat() {
        this.position.set(915, 0);
        this.messageBox = new ScrollPane(270, 300);
        this.messageBox.x = 10;
        this.messageBox.y = 280;
        let txtMessage = new TextField(10, 610);
        txtMessage.scale.set(0.28,0.3);
        txtMessage.onEnterPress=()=>{
            viewGame.player.emit("send message", txtMessage.getText());
            txtMessage.setText("");
        }
        let sendBtn = new Button(250, 610, "", App.AssetDir + "Picture/IU/sendmsg.png");
        sendBtn.setSize(new PIXI.Point(52, 38));
        sendBtn.onClick = () => {
            if (txtMessage.getText() != "") {
                viewGame.player.emit("send message", txtMessage.getText());
                txtMessage.setText("");
            }
        };
        this.addChild(this.messageBox, txtMessage, sendBtn);
    }

}