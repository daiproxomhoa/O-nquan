import {User} from "./User";
import {Room} from "./Room";
// /**
//  * Created by Vu Tien Dai on 01/08/2017.
//  */
export class Manages {
    users: User[];
    rooms: Room[];

    constructor() {
        this.users = [];
        this.rooms = [];
        for (let i = 0; i < 50; i++) {
            this.rooms.push(new Room(i, "Room " + i));
        }
    }

    addUser = (user: User) => {
        if(this.isOnline(user._username)==false) {
            this.users.push(user);
            user.emit("OK");
            this.initPlayerEvent(user);
        }
        else {
            user.emit("NO");
        }
    };

    initPlayerEvent = (user: User) => {
        user.on("getInviteList", () => {
            user.emit("InviteList", this.getInvite());
        });
        user.on("join room", (roomID) => {
            let findRoom = false;
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].id == roomID) {
                    findRoom = true;
                    if (this.rooms[i].isFull() == false) {
                        this.rooms[i].addUser(user)
                    }
                    else
                        user.emit("room full");
                    break;
                }
            }
            if (!findRoom) user.emit("cannot find room");
        });
        user.on("disconnect", () => {
            let index = this.users.findIndex((element): boolean => {
                return element == user;
            });
            user.isPlaying=false;
            user.idroom = null;
            console.log("Out roi")
            this.users.splice(index, 1);
        }, false);
        user.on("invited",(data:any)=>{
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i]._username == data.guest)
                    this.users[i].emit("Ẹnjoy",{key:data.key,id:user.idroom});
            }
        })
        user.on("get room list", () => {
            user.emit("room list", this.getRoomList());
        });
    }
    isOnline = (userName: string) => {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]._username == userName) return true;
        }
        return false;
    }
    getInvite = () => {
        let invite = [];
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].isPlaying == false)
                invite.push({name: this.users[i]._username});
        }
        return invite;
    }
    getRoomList = () => {
        let k = 1;
        let roomArr = [];
        for (let i = 0; i < 20; i++) {
            let done = false;
            while (this.rooms[k].isFull()) {
                k++;
                if (k >= this.rooms.length) {
                    done = true;
                    break;
                }
            }
            if (!done) {
                roomArr.push({
                    id: this.rooms[k].id,
                    name: this.rooms[k].name,
                    key: this.rooms[k].key,
                    playerNumber: this.rooms[k].users.length
                });
                k++;
            }
            else break;
        }
        return roomArr;

    }

}
//
// }