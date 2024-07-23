export class GlobalVariableStore {
    constructor(data = {}) {
        this.variableStore = data;
    }

    GetVariable(_var) {
        return this.variableStore[_var];
    }

    SetVariable(_var, _val) {
        this.variableStore[_var] = _val;
    }
}
