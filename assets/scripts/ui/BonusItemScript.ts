import { _decorator, Component, Label, Node, Sprite, SpriteComponent } from 'cc';
import { BonusType } from '../GameEnumerations';
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
        this._item.clickEvents[0].emit([this._item]);
    }
}