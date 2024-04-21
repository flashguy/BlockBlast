import { _decorator, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { Level } from '../Level';
import { GoalBlockScript } from './GoalBlockScript';
import { HiddenPanel } from './HiddenPanel';
const { ccclass, property } = _decorator;

@ccclass('LevelPanelScript')
export class LevelPanelScript extends HiddenPanel
{
    @property(Prefab)
    private goalPrefab:Prefab;

    @property(Label)
    private labelLevel:Label;

    @property(Node)
    private goals:Node;

    private _hideCallback:Function;
    
    public init(level:Level, hideCallback:Function):void
    {
        this._hideCallback = hideCallback;
        this.labelLevel.string = level.label.toString();

        this.goals.removeAllChildren();

        for (let i = 0; i < level.goals.length; i++)
        {
            let goal:Node = instantiate(this.goalPrefab);
            let goalPos:Vec3 = goal.getPosition();
            goalPos.x = (180 * i) - (((level.goals.length - 1) * 180) / 2);
            goal.setPosition(goalPos);
            
            let goalScript:GoalBlockScript = goal.getComponent(GoalBlockScript) as GoalBlockScript;
            goalScript.setGoal(level.goals[i]);

            this.goals.addChild(goal);
        }
    }

    public hide():void
    {
        this.hideWithScale(this._hideCallback);
    }
}