import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { HiddenPanel } from './HiddenPanel';
import { BonusItemScript } from './BonusItemScript';
import { BonusItem } from '../BonusItem';
const { ccclass, property } = _decorator;

@ccclass('BonusPanelScript')
export class BonusPanelScript extends HiddenPanel
{
    @property(Prefab)
    private bonusItem:Prefab;

    private bonuses:Array<BonusItemScript>;

    public init(bonuses:BonusItem[]):void
    {
        this.node.removeAllChildren();
        this.bonuses = new Array<BonusItemScript>;

        for (let i = 0; i < bonuses.length; i++)
        {
            let bonus:Node = instantiate(this.bonusItem);
            bonus.setPosition(new Vec3(0, (200 * i) - (((bonuses.length - 1) * 200) / 2)));

            let bonusScript:BonusItemScript = bonus.getComponent(BonusItemScript) as BonusItemScript;
            bonusScript.init(bonuses[i]);

            this.bonuses.push(bonusScript);
            this.node.addChild(bonus);
        }
    }

    public updateBonuses(money:number):void
    {
        for (let i = 0; i < this.bonuses.length; i++)
        {
            const bonus = this.bonuses[i];
            bonus.updateAvailable(money);
        }
    }
}