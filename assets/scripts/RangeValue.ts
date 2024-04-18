import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RangeValue')
export class RangeValue
{
    @property
    public min:number = 0;

    @property
    public max:number = 0;

    @property
    public trueIfMoreMax:boolean = false;

    @property
    public reward:number = 0;
}


