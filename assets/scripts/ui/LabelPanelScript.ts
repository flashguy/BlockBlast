import { _decorator, Color, Component, Label, math, Node, tween, Vec3 } from 'cc';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('LabelPanelScript')
export class LabelPanelScript extends HiddenPanel
{
    @property(Label)
    private label:Label;

    public setLebel(value:string, color?:Color, fontSize?:number):void
    {
        this.label.string = value;
        this.label.fontSize = fontSize ? fontSize : 120;
        this.label.color = color ? color : new math.Color(255, 255, 255, 255);
    }
}