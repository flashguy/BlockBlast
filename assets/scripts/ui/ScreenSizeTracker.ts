import { _decorator, Component, log, Node, ResolutionPolicy, screen, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScreenSizeTracker')
export class ScreenSizeTracker extends Component
{
    private _designWidth:number = 1280;
    private _designHeight:number = 960;

    start()
    {
        // log("start()", this.node.name, view.getDesignResolutionSize(), screen.resolution, view.getVisibleSize())
        // const resolutionSize = view.getDesignResolutionSize();
        // this._designWidth = resolutionSize.width;
        // this._designHeight = resolutionSize.height;

        this.onResize();
        view.on('canvas-resize', this.onResize, this);
    }

    protected onDestroy()
    {
        view.off('canvas-resize', this.onResize, this);
    }

    private onResize():void
    {
        // log("onResize()", this.node.name, view.getDesignResolutionSize(), screen.resolution, view.getVisibleSize())
        const screenSize = screen.windowSize;
        const scale = Math.max(
            this._designWidth / screenSize.width,
            this._designHeight / screenSize.height
        );
        const vWidth = screenSize.width * scale;
        const vHeight = screenSize.height * scale;

        // view.resizeWithBrowserSize(true);
        // view.setDesignResolutionSize(window.innerWidth, window.innerHeight, ResolutionPolicy.EXACT_FIT);
        view.setDesignResolutionSize(vWidth, vHeight, ResolutionPolicy.SHOW_ALL);
    }
}


