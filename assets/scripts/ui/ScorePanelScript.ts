import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('ScorePanelScript')
export class ScorePanelScript extends HiddenPanel
{
    @property(Label)
    private labelLevel:Label;

    @property(Label)
    private labelScore:Label;

    private _nextCallback:Function = null;
    private _menuCallback:Function = null;

    public init(level:number, score:number, nextCallback?:Function, menuCallback?:Function):void
    {
        this._nextCallback = nextCallback;
        this._menuCallback = menuCallback;

        this.labelLevel.string = level.toString();
        this.labelScore.string = score.toString();
    }

    public onNextClick():void
    {
        this.hideWithScale(this._nextCallback);
    }

    public onMenuClick():void
    {
        this.hideWithScale(this._menuCallback);
    }
}