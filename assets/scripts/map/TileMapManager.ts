import { _decorator, Component, Node, resources, SpriteFrame, Sprite, UITransform, Layers } from 'cc';
import Levels from '../levels';
import { createUINode, randomByRange } from '../utils/index';
import { TileManager } from './TileManager';
import DataManager from '../runtime/DataManager';
import ResourceManager from '../runtime/ResourceManager';
const { ccclass, property } = _decorator;


@ccclass('TileMapManager')
export class TileMapManager extends Component {
    async init() {
        const spriteFrams = await ResourceManager.Instance.loadDir('texture/tile/tile')
        const { mapInfo } = DataManager.Instance
        DataManager.Instance.tileInfo = []

        for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i]
            DataManager.Instance.tileInfo[i] = []
            for (let j = 0; j < column.length; j++) {
                const item = column[j]
                if (item.src == null || item.type == null) {
                    continue
                }

                let number = item.src
                if ((number == 1 || number == 5 || number == 9) && i % 2 == 0 && j % 2 == 0) {
                    number += randomByRange(0, 4)
                }
                const imgSrc = `tile (${number})`
                const spriteFrame = spriteFrams.find(v => v.name == imgSrc) || spriteFrams[0]

                const node = createUINode()
                const tilemanager = node.addComponent(TileManager)
                const type = item.type
                tilemanager.init(type, spriteFrame, i, j)
                DataManager.Instance.tileInfo[i][j] = tilemanager
                node.setParent(this.node)
            }
        }
    }


}

