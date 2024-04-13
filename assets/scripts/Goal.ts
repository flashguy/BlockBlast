import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Goal')
export class Goal
{
    @property
    public type:number = 0;

    @property
    public quantity:number = 0;
}