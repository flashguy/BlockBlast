import { _decorator, Component, instantiate, Label, Node, Prefab, UITransform, Vec3 } from 'cc';
import { Goal } from '../Goal';
const { ccclass, property } = _decorator;

@ccclass('GoalBlockScript')
export class GoalBlockScript extends Component
{
    @property([Prefab])
    private blokPrefabs:Prefab[] = [];

    @property(Node)
    private block:Node;

    @property(Label)
    private label:Label;

    public setGoal(goal:Goal):void
    {
        this.label.string = goal.quantity.toString();
        
        let block:Node = instantiate(this.blokPrefabs[goal.type]);
        const uiTransform = block.getComponent(UITransform);
        
        block.setPosition(new Vec3(-uiTransform.width / 2, 0, 0));
        
        this.block.addChild(block);
    }
}

