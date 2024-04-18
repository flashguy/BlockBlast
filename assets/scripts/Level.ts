import { _decorator } from 'cc';
import { Goal } from './Goal';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level
{
    @property
    public label:number = 0;

    @property
    public moves:number = 0;

    @property([Goal])
    public goals:Goal[] = [];
}


