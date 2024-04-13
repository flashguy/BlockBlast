import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScorePanelScript')
export class ScorePanelScript extends Component
{
    @property(Label)
    private labelLevel:Label;

    @property(Label)
    private labelScore:Label;

    start()
    {
        this.node.active = false;
    }

    update(deltaTime: number)
    {
        
    }

    public show(level:number, score:number):void
    {
        this.node.active = true;
        this.labelLevel.string = level.toString();
        this.labelScore.string = score.toString();

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

    public onNextClick():void
    {
        this.hide();
    }

    public onMenuClick():void
    {
        this.hide();
    }
}


