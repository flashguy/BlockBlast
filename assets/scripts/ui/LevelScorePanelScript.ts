import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelScorePanelScript')
export class LevelScorePanelScript extends Component
{
    @property(Label)
    private label:Label;

    @property(Vec3)
    private showPosition:Vec3 = new Vec3(0, 0, 0);

    @property(Vec3)
    private hidePosition:Vec3 = new Vec3(0, 0, 0);

    public show():void
    {
        this.node.active = true;
        this.node.setPosition(this.hidePosition);

        tween(this.node)
            .to(0.4, {position: this.showPosition}, { easing: 'linear' })
            .call(() => {
                
            })
            .start();
    }

    public hide():void
    {
        tween(this.node)
            .to(0.4, {position: this.hidePosition}, { easing: 'linear' })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }

    public setValue(value:number):void
    {
        this.label.string = value.toString();
    }
}


