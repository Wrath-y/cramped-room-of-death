import { _decorator, Component, Node, Sprite, UITransform } from 'cc'
import { WIDTH, HEIGHT } from '../map/TileManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM, ENTITY_TYPE_ENUM } from '../enums/index';
import { IEntity } from '../levels/index';
import { StateMachine } from './StateMachine';
import { randomByLen } from '../utils/index';
const { ccclass, property } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
    id: string = randomByLen(12)
    x: number = 0
    y: number = 0

    private _direction: DIRECTION_ENUM
    private _state: ENTITY_STATE_ENUM
    private type: ENTITY_TYPE_ENUM

    fsm: StateMachine

    get direction(): DIRECTION_ENUM { return this._direction }
    set direction(value: DIRECTION_ENUM) {
        this._direction = value
        this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[value])
    }

    get state(): ENTITY_STATE_ENUM { return this._state }
    set state(value: ENTITY_STATE_ENUM) {
        this._state = value
        this.fsm.setParams(value, true)
    }

    async init(params: IEntity) {
        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM

        const uiTransform = this.getComponent(UITransform)
        uiTransform.setContentSize(WIDTH * 4, HEIGHT * 4)

        this.x = params.x
        this.y = params.y
        this.type = params.type
        this.direction = params.direction
        this.state = params.state
    }

    update() {
        this.node.setPosition(this.x * WIDTH - 1.5 * WIDTH, this.y * HEIGHT + 1.5 * HEIGHT)
    }

    onDestroy() { }
}

