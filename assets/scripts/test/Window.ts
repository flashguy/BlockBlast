import { _decorator, Component, Event, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Window')
export class Window extends Component
{
    start()
    {
        // this.node.hasEventListener();
        this.node.dispatchEvent(new Event("asdasd"));
    }

    update(deltaTime: number)
    {
        
    }

    protected onLoad(): void
    {
        
    }

    public startEvent:Event;

    public ShowWindow():void
    {
        this.node.active = true;
        this.node.setScale(new Vec3(1.0, 1.0, 1));
    }

    public HideWindow():void
    {
        this.node.active = false;
        this.node.setScale(new Vec3(0.2, 0.2, 1));
    }

    public OK_Click():void
    {
        this.node.active = false;
    }
    
    public CANCEL_Click():void
    {

    }
}