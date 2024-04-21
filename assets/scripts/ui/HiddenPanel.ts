import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HiddenPanel')
export class HiddenPanel extends Component
{
    @property({ group: { name: 'position', id: '0', displayOrder: 1 }, type: Vec3, tooltip: "Позиция в которую будет перемешена панель" })
    private showPosition:Vec3 = new Vec3(0, 0, 0);

    @property({ group: { name: 'position', id: '0', displayOrder: 1 }, type: Vec3 })
    private hidePosition:Vec3 = new Vec3(0, 0, 0);

    @property({ group: { name: 'scale', id: '0', displayOrder: 2 }, type: Vec3 })
    private showScale:Vec3 = new Vec3(1, 1, 1);

    @property({ group: { name: 'scale', id: '0', displayOrder: 2 }, type: Vec3 })
    private hideScale:Vec3 = new Vec3(0, 0, 1);

    // linear | bounceOut | backOut 

    public showWithScale(callback?:Function):void
    {
        this.node.active = true;
        this.node.setScale(this.hideScale);
        this.node.setPosition(this.showPosition);

        tween(this.node)
            .to(0.4, {scale: this.showScale}, { easing: 'backOut' })
            .call(() => {
                if (callback)
                    callback();
            })
            .start();
    }

    public hideWithScale(callback?:Function):void
    {
        tween(this.node)
            .to(0.4, {scale: this.hideScale}, { easing: 'backIn' })
            .call(() => {
                this.node.active = false;
                if (callback)
                    callback();
            })
            .start();
    }

    public showWithMove(callback?:Function):void
    {
        this.node.active = true;
        this.node.setScale(this.showScale);
        this.node.setPosition(this.hidePosition);

        tween(this.node)
            .to(0.4, {position: this.showPosition}, { easing: 'backOut' })
            .call(() => {
                if (callback)
                    callback();
            })
            .start();
    }

    public hideWithMove(callback?:Function):void
    {
        tween(this.node)
            .to(0.4, {position: this.hidePosition}, { easing: 'backIn' })
            .call(() => {
                this.node.active = false;
                if (callback)
                    callback();
            })
            .start();
    }
}