// import {User} from "./User";
// import {Room} from "./Room";
// /**
//  * Created by Vu Tien Dai on 01/08/2017.
//  */
// export  class Manages{
//     users: User[];
//     rooms: Room[];
//     constructor() {
//         this.users = [];
//         this.rooms = [];
//         for (let i = 0; i < 50; i++) {
//             this.rooms.push(new Room(i, "Room " + i));
//         }
//     }
//
//     addUser = (user: User) => {
//         this.users.push(user);
//         this.initPlayerEvent(user);
//     };
//
//     isOnline = (userName: string) => {
//         for (let i = 0; i < this.users.length; i++) {
//             if (this.users[i]._username == userName) return true;
//         }
//         return false;
//     }
//
//     initPlayerEvent = (user: User) => {
//         user.on("get room list", () => {
//             user.emit("room list", this.getRoomList());
//         });
//         user.on("join room", (roomID) => {
//             let findRoom = false;
//             for (let i = 0; i < this.rooms.length; i++) {
//                 if (this.rooms[i].id == roomID) {
//                     findRoom = true;
//                     if (!this.rooms[i].addUser(user)) {
//                         user.emit("room full");
//                     }
//                     break;
//                 }
//             }
//             if (!findRoom) user.emit("cannot find room");
//         });
//
//         user.on("broadcast message", (msg: string) => {
//             user.emit("new broadcast message", {playername: user.username, message: msg});
//             user.socket.broadcast.emit("new broadcast message", {playername: user.username, message: msg})
//         });
//
//         user.on("disconnect", () => {
//             let index = this.users.findIndex((element): boolean => {
//                 return element == user;
//             });
//             this.users.splice(index, 1);
//         }, false);
//     }
//
//     getRoomList = () => {
//         let k = 1;
//         let roomArr = [];
//         for (let i = 0; i < 20; i++) {
//             let done = false;
//             while (this.rooms[k].isFull()) {
//                 k++;
//                 if (k >= this.rooms.length) {
//                     done = true;
//                     break;
//                 }
//             }
//             if (!done) {
//                 roomArr.push({
//                     id: this.rooms[k].id,
//                     name: this.rooms[k].name,
//                     stake: this.rooms[k].stake,
//                     playerNumber: this.rooms[k].users.length
//                 });
//                 k++;
//             }
//             else break;
//         }
//         return roomArr;
//
//     }
//
// }