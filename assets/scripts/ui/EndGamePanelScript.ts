import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EndGamePanelScript')
export class EndGamePanelScript extends Component
{
    public show():void
    {
        this.node.active = true;
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


