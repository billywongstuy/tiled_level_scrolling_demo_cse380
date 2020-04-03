import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import {TiledLayer} from './tiles/TiledLayer'
import {TileSet} from './tiles/TileSet'
import {Viewport} from './Viewport';
import { AnimatedSpriteType } from './sprite/AnimatedSpriteType';

export class SceneGraph {
    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<AnimatedSprite>;

    // WE ARE ALSO USING A TILING ENGINE FOR RENDERING OUR LEVEL
    // NOTE THAT WE MANAGE THIS HERE BECAUSE WE MAY INVOLVE THE TILED
    // LAYERS IN PHYSICS AND PATHFINDING AS WELL
    private tiledLayers : Array<TiledLayer>;
    private tileSets : Array<TileSet>;

    // THE VIEWPORT IS USED TO FILTER OUT WHAT IS NOT VISIBLE
    private viewport : Viewport;

    // KEEPS TRACK OF PLAYER
    private player : AnimatedSprite;
    private playerInControl : boolean;
    private playerNotInControlTimer : number;

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.clear();
    }

    public clear() : void {
        this.animatedSprites = [];
        this.visibleSet = [];
        this.tiledLayers = [];
        this.tileSets = [];
        this.playerInControl = true;
        this.playerNotInControlTimer = 0;
    }

    public addTileSet(tileSetToAdd : TileSet) : number {
        return this.tileSets.push(tileSetToAdd) - 1;
    }

    public getNumTileSets() : number {
        return this.tileSets.length;
    }

    public getTileSet(index : number) : TileSet {
        return this.tileSets[index];
    }

    public addLayer(layerToAdd : TiledLayer) : void {
        this.tiledLayers.push(layerToAdd);
    }

    public getNumTiledLayers() : number {
        return this.tiledLayers.length;
    }

    public getTiledLayers() : Array<TiledLayer> {
        return this.tiledLayers;
    }

    public getTiledLayer(layerIndex : number) : TiledLayer {
        return this.tiledLayers[layerIndex];
    }

    public getNumSprites() : number {
        return this.animatedSprites.length;
    }

    public setViewport(initViewport : Viewport) : void {
        this.viewport = initViewport;
    }

    public getViewport() : Viewport { 
        return this.viewport;
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public getSpriteAt(testX : number, testY : number) : AnimatedSprite {
        for (let sprite of this.animatedSprites) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }

    public getPlayer() : AnimatedSprite {
        return this.player;
    }

    public setPlayer(player : AnimatedSprite) : void {
        this.player = player;
    }

    public getIsPlayerInControl() : boolean {
        return this.playerInControl;
    }

    public stopPlayerControl() : void {
        if (this.playerInControl) {
            this.playerInControl = false;
            this.player.setDirection((this.player.getDirection() + 2) % 4);
        }
    }

    public movePlayer(delta : number) : void {
        let x : number = this.player.getPosition().getX();
        let y : number = this.player.getPosition().getY();
        let direction : number = this.player.getDirection();
        let angle : number = ((direction + 1) % 4) / 2 * Math.PI;
        let newX : number = x + Math.cos(angle);
        let newY : number = y - Math.sin(angle);

        let world : TiledLayer[] = this.tiledLayers;
        let worldWidth : number = world[0].getColumns() * world[0].getTileSet().getTileWidth();
        let worldHeight : number = world[0].getRows() * world[0].getTileSet().getTileHeight();

        if (!(newX < 0 || newX >= worldWidth || newY < 0 || newY >= worldHeight)) {
            this.player.getPosition().set(newX, newY, 0, 1);
        }

        this.playerNotInControlTimer += delta;
        if (this.playerNotInControlTimer >= 2000) {
            this.playerInControl = true;
            this.playerNotInControlTimer = 0;
        }
    }

    public getWinState(type : AnimatedSpriteType) : boolean {
        for (let i = 0; i < this.animatedSprites.length; i++) {
            let sprite : AnimatedSprite = this.animatedSprites[i];
            if (sprite.getSpriteType() == type && sprite.getState() != "DEAD") {
                return false;
            }
        }
        return true;
    }

    public debug_kill_type(type : AnimatedSpriteType) : void {
        for (let i = 0; i < this.animatedSprites.length; i++) {
            let sprite : AnimatedSprite = this.animatedSprites[i];
            if (sprite.getSpriteType() == type) {
                sprite.setState("DEAD");
            }
        }
    }

    /**
     * update
     * 
     * Called once per frame, this function updates the state of all the objects
     * in the scene.
     * 
     * @param delta The time that has passed since the last time this update
     * funcation was called.
     */
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta);
        }
    }

    public scope() : Array<AnimatedSprite> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            this.visibleSet.push(sprite);
        }

        return this.visibleSet;
    }
}