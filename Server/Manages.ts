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
        this.users.push(user);
        this.initPlayerEvent(user);
    };


    isOnline = (userName: string) => {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]._username == userName) return true;
        }
        return false;
    }

    initPlayerEvent = (user: User) => {
        user.on("join room", () => {
            let findRoom = false;
            while (findRoom == false) {
                for (let i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].isFull() == false && this.rooms[i].isEmty() == false) {
                        findRoom = true;
                        this.rooms[i].addUser(user);
                        break;
                    }
                }
            }
                setTimeout(() => {
                    if (findRoom == false) {
                        for (let i = 0; i < this.rooms.length; i++) {
                            if (this.rooms[i].isFull() == false) {
                                findRoom = true;
                                this.rooms[i].addUser(user);
                                break;
                            }
                        }
                    }
                }, 1000);
            }
            );
        user.on("join room now", () => {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].isFull() == false) {
                    this.rooms[i].addUser(user);
                    break;
                }
            }
        });
        // user.on("broadcast message", (msg: string) => {
        //     user.emit("new broadcast message", {playername: user.username, message: msg});
        //     user.socket.broadcast.emit("new broadcast message", {playername: user.username, message: msg})
        // });

        // user.on("disconnect", () => {
        //     let index = this.users.findIndex((element): boolean => {
        //         return element == user;
        //     });
        //     this.users.splice(index, 1);
        // }, false);
    }

}
//
// }