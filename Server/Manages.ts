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
        for (let i = 0; i < 30; i++) {
            this.rooms.push(new Room(i + 1, "Room " + i));
        }
    }

    addUser = (user: User) => {
        if (this.isOnline(user._username) == false) {
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
        user.on("getInfo", () => {
            user.emit("setInfo", {name: user._username, avatar: user.avatarID, sex: user.sex});
        })
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
            user.isPlaying = false;
            user.idroom = null;
            let index = this.users.findIndex((element): boolean => {
                return element == user;
            });
            console.log("Out roi")
            this.users.splice(index, 1);
        }, false);
        user.on("invited", (data: any) => {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i]._username == data.guest) {
                    this.users[i].emit("Ẹnjoy", {key: data.key, id: user.idroom});
                    break;
                }
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
        let roomArr = [];
        for (let i = 0; i < this.rooms.length; i++) {
            roomArr.push({
                id: this.rooms[i].id,
                key: this.rooms[i].key,
                playerNumber: this.rooms[i].users.length
            });
        }
        return roomArr;
    }

}
//
// }