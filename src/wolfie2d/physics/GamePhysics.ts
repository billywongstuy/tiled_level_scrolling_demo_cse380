import {SceneGraph} from '../scene/SceneGraph'
import { AnimatedSprite } from '../scene/sprite/AnimatedSprite'
import { ResourceManager } from '../files/ResourceManager';

export class GamePhysics {
    private sceneGraph : SceneGraph;
    private resourceManager : ResourceManager;

    constructor(sceneGraph : SceneGraph, resourceManager: ResourceManager) {
        this.sceneGraph = sceneGraph;
        this.resourceManager = resourceManager;
    }

    update(delta : number) : void {
        // UPDATE ALL OBJECT POSITIONS ACCORDING TO THEIR VELOCITIES
        // BUT MAKE SURE TO PERFORM COLLISION DETECTION AS WELL
        // NOTE, FOR THIS YOU SHOULD MAKE SURE EACH SCENE OBJECT
        // HAS A BOUNDING VOLUME LIKE EITHER AN AABB OR A CIRCLE

        let player : AnimatedSprite = this.sceneGraph.getPlayer();
        let playerX : number = player.getPosition().getX();
        let playerY : number = player.getPosition().getY();
        let sprites : Array<AnimatedSprite> = this.sceneGraph.scope();

        for (let i = 0; i < sprites.length; i++) {
            let sprite : AnimatedSprite = sprites[i];
            if (sprite != player) {
                let spriteX : number = sprite.getPosition().getX();
                let spriteY : number = sprite.getPosition().getY();
                let centerDistanceSquared : number = Math.pow(playerX - spriteX, 2) + Math.pow(playerY - spriteY, 2);
                let radiusSumSquared : number = Math.pow(5 + 5, 2);
                if (centerDistanceSquared <= radiusSumSquared) {   
                    if (sprite.getSpriteType() == this.resourceManager.getAnimatedSpriteType("COCKROACH")) {
                        sprite.setState("DYING");
                    }
                    else if (sprite.getSpriteType() == this.resourceManager.getAnimatedSpriteType("APHID")) {
                        this.sceneGraph.stopPlayerControl();
                    }
                }
            }
        }

        if (this.sceneGraph.getIsPlayerInControl() == false) {
            this.sceneGraph.movePlayer(delta);
        }

    }
};