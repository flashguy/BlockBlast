import { _decorator, animation, Label, Node, Tween, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile
{
    public node:Node = null;
    public pos:Vec2 = null;
    public type:number = -1;

    public tween:Tween<Node>;

    public updateLabel():void
    {
        this.node.getChildByName("Label").getComponent(Label).string = this.pos.toString();
    }
}