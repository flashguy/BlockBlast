import { _decorator, Component, Node } from 'cc';
import { RangeValue } from './RangeValue';
const { ccclass, property } = _decorator;

@ccclass('RangeVerifier')
export class RangeVerifier
{
    public static verify(value:number, range:RangeValue):boolean
    {
        if ((range.trueIfMoreMax && value >= range.max)
         || (value >= range.min && value <= range.max))
            return true;
        
        return false;
    }
}


