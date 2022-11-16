import Singleton from '../base/Singleton';
import { SpriteFrame, resources } from 'cc';

export default class ResourceManager extends Singleton {
    static get Instance() {
        return super.GetInstance<ResourceManager>();
    }


    loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir(path, type, (err, assets) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(assets)
            })
        })
    }
}
