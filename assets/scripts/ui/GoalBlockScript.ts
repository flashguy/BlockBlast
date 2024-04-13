import { _decorator, Component, Label, Node, Prefab } from 'cc';
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

    start()
    {

    }

    update(deltaTime: number)
    {
        
    }
}


