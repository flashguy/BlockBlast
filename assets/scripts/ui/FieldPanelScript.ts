import { _decorator, Node, UITransform, Vec2 } from 'cc';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('FieldPanelScript')
export class FieldPanelScript extends HiddenPanel
{
    @property(Node)
    private fieldBG:Node = null;

    @property(Node)
    private content:Node = null;

    @property
    private sizeScale:number = 100;

    public clear():void
    {
        this.content.removeAllChildren();
    }

    public add(node:Node):void
    {
        this.content.addChild(node);
    }

    public remove(node:Node):void
    {
        this.content.removeChild(node);
    }

    public init(size:Vec2, cellSize:Vec2):void
    {
        this.node.active = true;

        const uiTransform = this.fieldBG.getComponent(UITransform);
        uiTransform.setContentSize((this.sizeScale * (size.x * cellSize.x)) / 100, (this.sizeScale * (size.y * cellSize.x)) / 100);
    }
}