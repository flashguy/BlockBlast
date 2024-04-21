import { _decorator, Label } from 'cc';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('LevelScorePanelScript')
export class LevelScorePanelScript extends HiddenPanel
{
    @property(Label)
    private label:Label;

    public setValue(value:number):void
    {
        this.label.string = value.toString();
    }
}