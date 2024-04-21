import { _decorator, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlocksPrefabs')
export class BlocksPrefabs
{
    private static _bloсksPrefabs:Prefab[];

    public static setPrefabs(bloсksPrefabs:Prefab[]):void
    {
        this._bloсksPrefabs = bloсksPrefabs;
    }

    public static getblocksPrefabs():Prefab[]
    {
        return this._bloсksPrefabs;
    }

    public static getBlockPrefabByType(type:number):Prefab
    {
        return this._bloсksPrefabs[type];
    }

    public static getLength():number
    {
        return this._bloсksPrefabs.length;
    }
}


