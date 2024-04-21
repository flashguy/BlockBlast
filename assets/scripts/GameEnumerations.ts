import { _decorator, Enum } from 'cc';
const { ccclass, property } = _decorator;

export enum BonusType
{
    BOMB,
    SWAP
}
Enum(BonusType);