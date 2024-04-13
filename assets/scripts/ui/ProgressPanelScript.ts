import { _decorator, Component, log, Node, Tween, tween, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressPanelScript')
export class ProgressPanelScript extends Component
{
    @property(Node)
    private progressNode:Node = null;

    @property(Vec3)
    private showPosition:Vec3 = new Vec3(0, 407, 0); // 670;

    @property(Vec3)
    private hidePosition:Vec3 = new Vec3(0, 600, 0); // 670

    @property
    private tweenSpeed:number = 200;

    private _tween:Tween<Node>;
    private _progressVec:Vec3 = new Vec3();
    private _progress:number = 0;
    private _tweenDuration:number = 1;

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

    public setProgress(value:number, animate:boolean)
    {
        const uiTransform = this.progressNode.getComponent(UITransform);
        let barWidth:number = uiTransform.contentSize.width;
        
        this._progress = value > 100 ? 100 : value;
        this._progressVec.x = ((barWidth * this._progress) / 100) - (barWidth / 2);
        this._tweenDuration = (this._progressVec.x - this.progressNode.getPosition().x) / this.tweenSpeed;

        if (animate)
        {
            if (this._tween)
                this._tween.stop();
    
            tween(this.progressNode)
                .to(this._tweenDuration, {position: new Vec3(this._progressVec)}, { easing: 'linear' })
                .call(() => {
                    
                })
                .start();
        }
        else
        {
            this.progressNode.setPosition(this._progressVec);
        }
    }

    public getProgress():number
    {
        return this._progress;
    }
}


