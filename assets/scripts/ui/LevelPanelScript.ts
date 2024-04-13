import { _decorator, Component, Label, Node, Prefab, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelPanelScript')
export class LevelPanelScript extends Component
{
    @property(Label)
    private labelLevel:Label;

    @property(Node)
    private goals:Node;

    public show(level:number):void
    {
        this.node.active = true;
        this.labelLevel.string = level.toString();

        this.node.setScale(new Vec3(0, 0, 1));

        tween(this.node)
            .to(0.4, {scale: new Vec3(0.5, 0.5, 1)}, { easing: 'linear' })
            .call(() => {
                
            })
            .start();
    }

    public hide():void
    {
        tween(this.node)
            .to(0.2, {scale: new Vec3(0, 0, 1)}, { easing: 'linear' })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }
}


