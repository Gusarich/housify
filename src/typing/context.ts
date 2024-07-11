import { Type } from './type';

export class StatementContext {
    variables: Map<string, Type>;

    constructor() {
        this.variables = new Map();
    }

    addVariable(name: string, type: Type) {
        this.variables.set(name, type);
    }

    getVariable(name: string) {
        return this.variables.get(name);
    }

    hasVariable(name: string) {
        return this.variables.has(name);
    }

    deleteVariable(name: string) {
        this.variables.delete(name);
    }
}
