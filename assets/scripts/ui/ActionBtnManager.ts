import { _decorator, Component, Node } from 'cc';
import EventManager from '../runtime/EventManager';
import { EVENT_ENUM, PLAYER_CTRL_ENUM } from '../enums/index';
const { ccclass, property } = _decorator;

@ccclass('ActionBtnManager')
export class ActionBtnManager extends Component {
    handleCtrl(e: Event, move_type: string) {
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, move_type as PLAYER_CTRL_ENUM);
    }
}

