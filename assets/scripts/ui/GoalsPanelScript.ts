import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { Level } from '../Level';
import { GoalItemScript } from './GoalItemScript';
const { ccclass, property } = _decorator;

@ccclass('GoalsPanelScript')
export class GoalsPanelScript extends Component
{
    @property(Prefab)
    private goalPrefab:Prefab;

    @property(Vec3)
    private showPosition:Vec3 = new Vec3(0, 0, 0);

    @property(Vec3)
    private hidePosition:Vec3 = new Vec3(0, 0, 0);

    private _goalsItemsScripts:Array<GoalItemScript> = new Array<GoalItemScript>();

    public show(level:Level):void
    {
        this._goalsItemsScripts = new Array<GoalItemScript>();
        this.node.active = true;
        this.node.setPosition(this.hidePosition);
        this.node.removeAllChildren();

        for (let i = 0; i < level.goals.length; i++)
        {
            let goalItem:Node = instantiate(this.goalPrefab);
            let goalItemScript:GoalItemScript = goalItem.getComponent(GoalItemScript) as GoalItemScript;
            goalItemScript.setGoal(level.goals[i]);

            this._goalsItemsScripts.push(goalItemScript);

            let goalItemPos:Vec3 = goalItem.getPosition();
            goalItemPos.y = -(120 * i);

            goalItem.setPosition(goalItemPos);

            this.node.addChild(goalItem);
        }

        tween(this.node)
            .to(0.4, {position: this.showPosition}, { easing: 'linear' })
            .call(() => {
                
            })
            .start();
    }

    public hide():void
    {
        tween(this.node)
            .to(0.4, {position: this.hidePosition}, { easing: 'linear' })
            .call(() => {
                this.node.active = false;
            })
            .start();
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


