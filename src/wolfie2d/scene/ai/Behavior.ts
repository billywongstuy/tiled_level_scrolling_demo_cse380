import { AnimatedSprite } from "../sprite/AnimatedSprite";
import { SceneGraph } from "../SceneGraph";

export class Behavior {
    private animatedSprite : AnimatedSprite;
    private scene : SceneGraph;

    public constructor(scene : SceneGraph, animatedSprite : AnimatedSprite) {
        this.scene = scene;
        this.animatedSprite = animatedSprite;
    }

    public getAnimatedSprite() : AnimatedSprite {
        return this.animatedSprite;
    }

    public getScene() : SceneGraph {
        return this.scene;
    }

    public takeAction() : void {}

}