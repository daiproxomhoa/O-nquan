import {ScrollPane} from "../IU/ScollPane";
import {TextField} from "../IU/TextField";
import {Button} from "../IU/Button";
import {viewGame} from "./viewGame";
/**
 * Created by Vu Tien Dai on 01/08/2017.
 */
export class Chat extends PIXI.Container {

    messageBox: ScrollPane;

    constructor() {
        super();
        this.createChat();
    }

    createChat() {;
        this.position.set(900, 0)
        this.messageBox = new ScrollPane(270, 300);
        this.messageBox.x = 10;
        this.messageBox.y = 280;
        let txtMessage = new TextField(10, 610);
        txtMessage.scale.set(0.3);
        let sendBtn = new Button(258, 610, "", "../Picture/IU/sendmsg.png");
        sendBtn.setSize(new PIXI.Point(40, 30));
        sendBtn.onClick = () => {
            if (txtMessage.getText() != "") {
                viewGame.player.emit("send message", txtMessage.getText());
                txtMessage.setText("");
            }
        };
        this.addChild(this.messageBox, txtMessage, sendBtn);
    }

}