import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('LabelPanelScript')
export class LabelPanelScript extends HiddenPanel
{
    @property(Label)
    private label:Label;

    public setLebel(value:string, fontSize?:number):void
    {
        this.label.string = value;
        this.label.fontSize = fontSize ? fontSize : 120;
    }
}