import { _decorator, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Level } from '../Level';
import { GoalItemScript } from './GoalItemScript';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('GoalsPanelScript')
export class GoalsPanelScript extends HiddenPanel
{
    @property(Prefab)
    private goalPrefab:Prefab;

    private _goalsItemsScripts:Array<GoalItemScript> = new Array<GoalItemScript>();

    public init(level:Level):void
    {
        this._goalsItemsScripts = new Array<GoalItemScript>();
        this.node.removeAllChildren();

        for (let i = 0; i < level.goals.length; i++)
        {
            let goalItem:Node = instantiate(this.goalPrefab);
            let goalItemScript:GoalItemScript = goalItem.getComponent(GoalItemScript);
            goalItemScript.setGoal(level.goals[i]);

            this._goalsItemsScripts.push(goalItemScript);

            let goalItemPos:Vec3 = goalItem.getPosition();
            goalItemPos.y = -(120 * i);

            goalItem.setPosition(goalItemPos);

            this.node.addChild(goalItem);
        }
    }

    public updateValues(goals:Map<number, number>):void
    {
        for (let i:number = 0; i < this._goalsItemsScripts.length; i++)
        {
            if (goals.has(this._goalsItemsScripts[i].getGoalType()))
            {
                this._goalsItemsScripts[i].setValue(goals.get(this._goalsItemsScripts[i].getGoalType()));
            }
        }
    }
}