import { _decorator, Component, Node, SpriteFrame, UITransform, Sprite } from 'cc';
import { TILE_TYPE_ENUM } from '../enums/index';
const { ccclass, property } = _decorator;

export const WIDTH = 55;
export const HEIGHT = 55;

@ccclass('TileManager')
export class TileManager extends Component {
    type: TILE_TYPE_ENUM
    moveAble: boolean
    turnAble: boolean

    init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
        this.type = type
        if (this.type == TILE_TYPE_ENUM.WALL_ROW ||
            this.type == TILE_TYPE_ENUM.WALL_COLUMN ||
            this.type == TILE_TYPE_ENUM.WALL_LEFT_TOP ||
            this.type == TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
            this.type == TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
            this.type == TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
        ) {
            this.moveAble = false
            this.turnAble = false
        }
        if (this.type == TILE_TYPE_ENUM.CLIFF_CENTER ||
            this.type == TILE_TYPE_ENUM.CLIFF_LEFT ||
            this.type == TILE_TYPE_ENUM.CLIFF_RIGHT
        ) {
            this.moveAble = false
            this.turnAble = true
        }
        if (this.type == TILE_TYPE_ENUM.FLOOR
        ) {
            this.moveAble = true
            this.turnAble = true
        }

        const sprite = this.addComponent(Sprite)
        sprite.spriteFrame = spriteFrame
        const transform = this.getComponent(UITransform)
        transform.setContentSize(WIDTH, HEIGHT)
        this.node.setPosition(i * WIDTH, -j * HEIGHT)
    }
}

