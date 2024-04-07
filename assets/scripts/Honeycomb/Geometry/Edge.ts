import { _decorator, Component, Node, Vec2 } from 'cc';
import { Position } from './Enumerations';
const { ccclass, property } = _decorator;

@ccclass('Edge')
export class Edge
{
    public v1:Vec2;
    public v2:Vec2;

    constructor(v1?:Vec2, v2?:Vec2)
    {
        this.v1 = v1 ? v1 : new Vec2();
        this.v2 = v2 ? v2 : new Vec2();
    }

    public set(e:Edge):Edge
    {
        this.v1.set(e.v1);
        this.v2.set(e.v2);

        return this;
    }
    
    public add(v:Vec2):Edge
    {
        this.v1.add(v);
        this.v2.add(v);

        return this;
    }

    public pointToEdgeDistance(v:Vec2):number
    {
        return (this.v2.x - this.v1.x) * (v.y - this.v1.y) - (this.v2.y - this.v1.y) * (v.x - this.v1.x);
    }

    public toString(): string
    {
        return "{ v1 " + this.v1.toString() + ", v2 " + this.v2.toString() + " }";
    }
}