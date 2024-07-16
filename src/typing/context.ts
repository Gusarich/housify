import { Type } from './type';

export class StatementContext {
    variables: Map<string, Type>;

    constructor() {
        this.variables = new Map();
    }

    clone() {
        const sctx = new StatementContext();
        for (const [name, type] of this.variables) {
            sctx.addVariable(name, type);
        }
        return sctx;
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
