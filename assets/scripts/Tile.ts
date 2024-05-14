import { _decorator, Label, Node, Tween, Vec2, Vec3} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile
{
    public node:Node = null;
    public pos:Vec2 = null;
    public type:number = -1;

    public tween:Tween<Node>;

    private _blockScale:Vec3 = new Vec3(0.5, 0.5, 1);
    private _blockSelectedScale:Vec3 = new Vec3(0.45, 0.45, 1);
    private _blockPos:Vec3 = new Vec3();

    public updateLabel(str:string = ""):void
    {
        this.node.getChildByName("Label").getComponent(Label).string = this.pos.toString() + " / " + str;
    }

    public init():void
    {
        this.node.getChildByName("Label").active = false;
        this.node.active = true;
        this._blockPos = this.node.getPosition().clone();
        this.setSelected(false);
    }

    public setSelected(selected:boolean = false):void
    {
        if (selected)
        {
            this._blockPos = this.node.getPosition().clone();
            this.node.setScale(this._blockSelectedScale);
            this.node.setPosition(this._blockPos.clone().add(new Vec3(5, 5, 0)));
        }
        else
        {
            this.node.setScale(this._blockScale);
            this.node.setPosition(this._blockPos);
        }
    }
}