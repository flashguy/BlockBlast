import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BonusItem } from '../BonusItem';
const { ccclass, property } = _decorator;

@ccclass('BonusItemScript')
export class BonusItemScript extends Component
{
    @property(Node)
    private bg:Node;

    @property(Node)
    private icon:Node;

    @property(Label)
    private label:Label;

    private _item:BonusItem;
    private _available:boolean = false;

    public init(item:BonusItem):void
    {
        this._item = item;
        this.label.string = item.price.toString();

        let sprite:Sprite = this.icon.addComponent(Sprite);
        sprite.spriteFrame = item.icon;

        this.icon.setScale(item.iconScale);
    }

    public click():void
    {
        if (this._available)
            this._item.clickEvents[0].emit([this._item]);
    }

    public updateAvailable(money:number):void
    {
        this._available = money >= this._item.price;
        this.bg.getComponent(Sprite).grayscale = !this._available;
    }
}