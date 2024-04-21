import { _decorator, Node, Tween, tween, UITransform, Vec3 } from 'cc';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('ProgressPanelScript')
export class ProgressPanelScript extends HiddenPanel
{
    @property(Node)
    private progressNode:Node = null;

    @property
    private tweenSpeed:number = 200;

    private _tween:Tween<Node>;
    private _progressVec:Vec3 = new Vec3();
    private _progress:number = 0;
    private _tweenDuration:number = 1;

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
    
            this._tween = tween(this.progressNode)
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