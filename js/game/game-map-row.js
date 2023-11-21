class GameMapRow {
    constructor(count = 0, columns = []) {
        this.count = count;
        this.columns = columns;
    }

    setCount(value) {
        this.count = value;
    }

    setColumns(newColumns) {
        this.columns = newColumns;
    }

    getCount() {
        return this.count;
    }

    getColumns() {
        return this.columns;
    }
}
