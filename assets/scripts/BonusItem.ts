import { _decorator, EventHandler, SpriteFrame, Vec3 } from 'cc';
import { BonusType } from './GameEnumerations';
const { ccclass, property } = _decorator;

@ccclass('BonusItem')
export class BonusItem
{
    @property({ type: BonusType })
    public type = BonusType.BOMB;

    @property
    public price:number = 0;

    @property(SpriteFrame)
    public icon:SpriteFrame;

    @property(Vec3)
    public iconScale:Vec3 = new Vec3(1, 1, 1);

    @property([EventHandler])
    public clickEvents:EventHandler[] = [];

    // @property(EventHandler)
    // public clickEvent:EventHandler = null;
}