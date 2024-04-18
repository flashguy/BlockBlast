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

    public init(level:number, score:number):void
    {
        this.labelLevel.string = level.toString();
        this.labelScore.string = score.toString();
    }

    public onNextClick():void
    {
        this.hideWithScale();
    }

    public onMenuClick():void
    {
        this.hideWithScale();
    }
}