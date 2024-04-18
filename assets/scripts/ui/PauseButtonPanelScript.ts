import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PauseButtonPanelScript')
export class PauseButtonPanelScript extends Component
{
    @property(Vec3)
    private showPosition:Vec3 = new Vec3(0, 0, 0); // 670;

    @property(Vec3)
    private hidePosition:Vec3 = new Vec3(0, 0, 0); // 670

    start()
    {

    }

    update(deltaTime: number)
    {
        
    }

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
}


