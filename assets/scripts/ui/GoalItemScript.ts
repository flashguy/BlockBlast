import { _decorator, Component, instantiate, Label, Node, UITransform, Vec3 } from 'cc';
import { Goal } from '../Goal';
import { BlocksPrefabs } from '../BlocksPrefabs';
const { ccclass, property } = _decorator;

@ccclass('GoalItemScript')
export class GoalItemScript extends Component
{
    @property(Node)
    private block:Node;

    @property(Label)
    private label:Label;

    private _goal:Goal;

    public setGoal(goal:Goal):void
    {
        this._goal = goal;
        this.setValue(goal.quantity);
        
        let block:Node = instantiate(BlocksPrefabs.getBlockPrefabByType(goal.type));
        block.getChildByName("Label").active = false;
        block.setScale(new Vec3(0.4, 0.4, 1));

        const uiTransform = block.getComponent(UITransform);
        block.setPosition(new Vec3((-uiTransform.width / 2) * 0.4, (-uiTransform.height / 2) * 0.4, 0));
        
        this.block.addChild(block);
    }

    public getGoalType():number
    {
        return this._goal.type;
    }

    public setValue(value:number):void
    {
        this.label.string = value.toString();
    }
}