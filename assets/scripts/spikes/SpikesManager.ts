import { _decorator, Component, Node, Sprite, UITransform } from 'cc'
import { WIDTH, HEIGHT } from '../map/TileManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM, ENTITY_TYPE_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM, EVENT_ENUM } from '../enums/index';
import { IEntity, ISpikes } from '../levels/index';
import { randomByLen } from '../utils/index';
import { StateMachine } from '../base/StateMachine';
import { SpikesStateMachine } from './SpikesStateMachine';
import EventManager from '../runtime/EventManager';
import DataManager from '../runtime/DataManager';
const { ccclass, property } = _decorator

@ccclass('SpikesManager')
export class SpikesManager extends Component {
    id: string = randomByLen(12)
    x: number = 0
    y: number = 0

    private _count: number
    private _totalCount: number
    private type: ENTITY_TYPE_ENUM

    fsm: StateMachine

    get count(): number { return this._count }
    set count(value: number) {
        this._count = value
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, value)
    }

    get totalCount(): number { return this._totalCount }
    set totalCount(value: number) {
        this._totalCount = value
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, value)
    }

    async init(params: ISpikes) {
        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM

        const uiTransform = this.getComponent(UITransform)
        uiTransform.setContentSize(WIDTH * 4, HEIGHT * 4)

        this.fsm = this.addComponent(SpikesStateMachine)
        await this.fsm.init()

        this.x = params.x
        this.y = params.y
        this.type = params.type
        this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
        this.count = params.count

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
    }

    update() {
        this.node.setPosition(this.x * WIDTH - 1.5 * WIDTH, this.y * HEIGHT + 1.5 * HEIGHT)
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop)
    }

    onLoop() {
        if (this.count == this.totalCount) {
            this.count = 1
        } else {
            this.count++
        }
        this.onAttack()
    }

    backZero() {
        this.count = 0
    }

    onAttack() {
        if (!DataManager.Instance.player) { return }
        const { x: playerX, y: playerY } = DataManager.Instance.player
        if (this.count == this.totalCount && this.x == playerX && this.y == playerY) {
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
        }
    }
}

