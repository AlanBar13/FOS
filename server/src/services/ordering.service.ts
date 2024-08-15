import NodeCache from "node-cache";
import { ORDERING_ENABLED_KEY } from "../constants";
import logger from "../utils/logger";
import cache from "../utils/cache";

class OrderingService {
    private cache: NodeCache;

    constructor(cache: NodeCache){
        this.cache = cache;
    }

    get orderingState(): boolean{
        return this.cache.get<boolean>(ORDERING_ENABLED_KEY) ? true : false;
    }

    disableOrdering(){
        this.deleteOrderingKey();
        this.cache.set(ORDERING_ENABLED_KEY, false, 0);
        logger.info("Ordering disabled")
    }

    enableOrdering(){
        this.deleteOrderingKey();
        this.cache.set(ORDERING_ENABLED_KEY, true, 0);
        logger.info("Ordering enabled")
    }

    private deleteOrderingKey() {
        if(this.cache.get<boolean>(ORDERING_ENABLED_KEY) != null){
            this.cache.del(ORDERING_ENABLED_KEY)
        }
    }
}

export default new OrderingService(cache);