import { _decorator } from 'cc';
import { Goal } from './Goal';
const { ccclass, property } = _decorator;

@ccclass('Goals')
export class Goals
{
    @property
    public level:number = 0;

    @property([Goal])
    public levelGoals:Goal[] = [];
}


