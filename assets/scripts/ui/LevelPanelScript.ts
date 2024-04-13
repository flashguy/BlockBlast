import { _decorator, Component, instantiate, Label, log, Node, Prefab, tween, Vec3 } from 'cc';
import { Level } from '../Level';
import { GoalBlockScript } from './GoalBlockScript';
const { ccclass, property } = _decorator;

@ccclass('LevelPanelScript')
export class LevelPanelScript extends Component
{
    @property(Prefab)
    private goalPrefab:Prefab;

    @property(Label)
    private labelLevel:Label;

    @property(Node)
    private goals:Node;

    private _hideCallback:Function;

    public show(level:Level, hideCallback:Function):void
    {
        this._hideCallback = hideCallback;
        this.node.active = true;
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

        this.node.setScale(new Vec3(0, 0, 1));

        tween(this.node)
            .to(0.4, {scale: new Vec3(0.5, 0.5, 1)}, { easing: 'linear' })
            .call(() => {
                
            })
            .start();
    }

    public hide():void
    {
        tween(this.node)
            .to(0.2, {scale: new Vec3(0, 0, 1)}, { easing: 'linear' })
            .call(() => {
                if (this._hideCallback)
                    this._hideCallback();

                this.node.active = false;
            })
            .start();
    }
}


