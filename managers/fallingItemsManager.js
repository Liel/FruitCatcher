class dynamicItemsManager {
    currentDynamicItems = {}
    numInPathPositionLeftRange;
    generateItemsTimeout;
    pathsCount;
    currentInstance;
    fruits = ["129373", "129365", "129382", "129381", "127827", "127815"]
    intervalDelay = 800
    speedInceasedNum = 58; // initial value should be aligned with 'fallingNum' css class
    itemTypes = {
        REGULAR_NUM: "REGULAR_NUM",
        OBSTACLE: "OBSTACLE",
        GOLD: "GOLD"
    }

    prepareItemByType = {
        "REGULAR_NUM": this.prepateRegularNum.bind(this),
        "OBSTACLE": this.prepateObstacle.bind(this),
        "GOLD": this.prepareGoldNum.bind(this)
    }

    constructor(pathsCount, numInPathPositionLeftRange) {
        this.pathsCount = pathsCount;
        this.numInPathPositionLeftRange = numInPathPositionLeftRange
        this.currentInstance = this;

        this.generateNewNumberItem = this.generateNewNumberItem.bind(this); 
        this.prepateRegularNum = this.prepateRegularNum.bind(this);
        this.prepateObstacle = this.prepateObstacle.bind(this);
    }

    initTimeout() {
       this.generateItemsTimeout = setTimeout(this.generateNewNumberItem, 400);
    }

    stopTimeout() {
        clearTimeout(this.generateItemsTimeout);
    }

    randomizePath() {
        var d = Math.random();
        if (d < 0.5)
            // 50% chance of being here
            return 1

         return 2    
        // else if (d < 0.8)
        //     return 2
        // else if (d < 0.9)
        //     return 3
        // else {
        //     return 4
        // }
    }

    randomizeItemType() {
        var d = Math.random();
        if (d < 0.9)
            // 50% chance of being here
            return "REGULAR_NUM"
        else
            return "OBSTACLE"
    }

    createDynamicItems() {
        var items = []
        for (let path = 1; path <= this.pathsCount; path++) {
            const item = {
                path,
                type: this.currentInstance.randomizeItemType(),
                id: uuidv4()
            }

            this.prepareItemByType[item.type](item);
            
            items.push(item)
        }

        return items;
    }

    generateNewNumberItem() {
        if(!animationAllowed)
            return;
    
        const newItemsPerPath = shuffle(this.createDynamicItems());
        const numOfItemsToPrint = this.randomizePath() - 1;
        for (let itemIdx = 0; itemIdx < newItemsPerPath.length; itemIdx++) {
            if(itemIdx > numOfItemsToPrint) {
                delete newItemsPerPath[itemIdx];
                continue;
            }
            const newDynamicItem = newItemsPerPath[itemIdx]
            const itemSpeed = this.randomizeSpeed()
            const animationDuration = `animation-duration: ${itemSpeed}s; -webkit-animation-duration: ${itemSpeed}s; -moz-animation-duration: ${itemSpeed}s; -o-animation-duration: ${itemSpeed}s;`
            const top = this.randomizeTop()
            const htmlItem = `<div style="top: ${top}%; left: ${randomIntFromInterval(numInPathPositionLeftRange[0], numInPathPositionLeftRange[1])}%; ${animationDuration}"
                                    item-id="${newDynamicItem.id}" 
                                    id="${newDynamicItem.id}"
                                    class='fallingNumber noselect ${newDynamicItem.class}'>${newDynamicItem.displayValue}<div>`

            // print to screen
            document.getElementsByClassName('path')[newDynamicItem.path - 1].insertAdjacentHTML( 'beforeend', htmlItem );

            // Save in local cache
            newDynamicItem.htmlElement = document.getElementById(newDynamicItem.id);
            this.currentDynamicItems[newDynamicItem.id] = newDynamicItem;
        }
      
      this.generateItemsTimeout = setTimeout(this.generateNewNumberItem.bind(this), this.intervalDelay);
    }

    prepateRegularNum(item) {
        const isPlus = !isOverlappingTargetNumber()
        item.operator = isPlus ? "plus" : "minus";
        item.numericValue = 5//randomIntFromInterval(1, 10)
        item.displayValue = `&#${this.randomizeFruit()};`
    }

    levelIncreased() {
        this.intervalDelay -= 25
    }

    randomizeFruit() {
        return this.fruits[randomIntFromInterval(0, this.fruits.length - 1)]
    }

    prepareGoldNum(item) {
        item.numericValue = targetNumber - aggregatedValue
        const isPlus = item.numericValue > 0
        item.operator = isPlus ? "plus" : "minus";
        item.numericValue = Math.abs(item.numericValue)
        item.displayValue = `${isPlus ? "" : "-"}${item.numericValue}`
        // TODO: emit event
        item.class = "gold";
    }

    prepateObstacle(item) {
        item.numericValue = 5
        item.isPlus = isOverlappingTargetNumber()
        item.operator = item.isPlus ? "plus" : "minus";
        item.displayValue = `&#129472;`
        // TODO: emit event
        item.class = "obstacle";
    }   

    removeItemById(item) {
        if(item.htmlElement)
            item.htmlElement.remove()
        
        delete this.currentDynamicItems[item.id]
    }

    removeAll() {
        document.querySelectorAll('.fallingNumber').forEach(i => i.remove()); 
        this.currentDynamicItems = {}
    }

    getIdFromHtmlElement(htmlElement) {
        return htmlElement.getAttribute("item-id")
    }

    getDynamicItemById(id) {
        return this.currentDynamicItems[id]
    }

    getAllItems() {
        return Object.values(this.currentDynamicItems)
    }

    // this method created so the items will be dynamic with a small gap
    // and not falling together at the same line
    randomizeSpeed() { 
        return this.speedInceasedNum - (coins * 3)
        randomIntFromInterval(this.speedInceasedNum - 0.1, this.speedInceasedNum + 0.1)
    }

    randomizeTop() {
        return randomIntFromInterval(0, -8)
    }

    increaseSpeed() {
        this.speedInceasedNum-= 1.5;   
        // document.getElementById("container").style["-webkit-animation-duration"] = this.speedInceasedNum + "s";
    }
}