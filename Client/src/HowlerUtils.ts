/**
 * Created by Vu Tien Dai on 11/08/2017.
 */
import * as howler from 'howler';
import  Howl = howler.Howl;
import {App} from "./Const/App";
export class HowlerUtils {
    public static QueenGarden = new Howl({
        src: [App.AssetDir + 'SoundTrack/QueenGarden.mp3'],
        loop: true,
        volume: 0.15
    });
    public static Orbis = new Howl({
        src: [App.AssetDir + 'SoundTrack/Orbis.mp3'],
        loop: true,
        volume: 0.15
    });

    public static HetGio = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/hetgio.mp3'],
        volume: 0.5
    });
    public static AnQuan = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/anquan.m4a'],
        volume: 0.5
    });
    public static ConGa = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/conga.m4a'],
        volume: 0.5
    });
    public static An = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/An.m4a'],
        volume: 0.5
    });
    public static HaiNha = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/Hainha.m4a'],
        volume: 0.5
    });
    public static DiDau = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/didauroi.m4a'],
        volume: 0.5
    });
    public static Hazz = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/haz.m4a'],
        volume: 0.5
    });
    public static Othua = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/othuaa.m4a'],
        volume: 0.5
    });
    public static TQKV = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/TQKV.m4a'],
        volume: 0.5
    });
    public static TQBR = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/TQBR.m4a'],
        volume: 0.5
    });
    public static TRBT = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/TRBT.m4a'],
        volume: 0.5
    });
    public static TrungLon = new Howl({
        src: [App.AssetDir + 'SoundTrack/Game/trunglon.m4a'],
        volume: 0.5
    });
    public static Stone = new Howl({
        src: [App.AssetDir + 'SoundTrack/Stone.wav']
    });
    public static Login = new Howl({
        src: [App.AssetDir + 'SoundTrack/LoginMaple.mp3'],
        volume: 1.5,
        loop: true
    });
    public static MouseClick = new Howl({
        src: [App.AssetDir + 'SoundTrack/Mouse.aif'],
        volume: 2
    });
}