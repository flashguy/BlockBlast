import { _decorator, Component, Graphics, Node, tween, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FieldPanelScript')
export class FieldPanelScript extends Component
{
    @property(Node)
    private fieldBG:Node = null;

    @property(Node)
    private content:Node = null;

    @property
    private sizeScale:number = 100;

    start()
    {
        const g = this.content.getComponent(Graphics);
        g.lineWidth = 5;
        g.moveTo(0, 1000)
        g.lineTo(0, -1000);
        g.moveTo(-1000, 0);
        g.lineTo(1000, 0);
        g.close();
        g.stroke();
    }

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

    public show(size:Vec2, cellSize:Vec2):void
    {
        this.node.active = true;

        const uiTransform = this.fieldBG.getComponent(UITransform);
        uiTransform.setContentSize((this.sizeScale * (size.x * cellSize.x)) / 100, (this.sizeScale * (size.y * cellSize.x)) / 100);

        this.node.setScale(new Vec3(0, 0, 1));

        tween(this.node)
            .to(0.4, {scale: new Vec3(1, 1, 1)}, { easing: 'linear' })
            .call(() => {
                
            })
            .start();
    }

    public hide():void
    {
        tween(this.node)
            .to(0.4, {scale: new Vec3(0, 0, 1)}, { easing: 'linear' })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }
}


