import { Type } from './type';

export class StatementContext {
    variables: Map<string, Type>;
    types: Map<string, Type>;

    constructor() {
        this.variables = new Map();
        this.types = new Map();
    }

    clone() {
        const sctx = new StatementContext();
        for (const [name, type] of this.variables) {
            sctx.addVariable(name, type);
        }
        for (const [name, type] of this.types) {
            sctx.addType(name, type);
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

    addType(name: string, type: Type) {
        this.types.set(name, type);
    }

    getType(name: string) {
        return this.types.get(name);
    }

    hasType(name: string) {
        return this.types.has(name);
    }

    deleteType(name: string) {
        this.types.delete(name);
    }
}

export class CompilerContext {
    expressions: Map<number, Type>;

    constructor() {
        this.expressions = new Map();
    }

    clone() {
        const ctx = new CompilerContext();
        for (const [id, type] of this.expressions) {
            ctx.addExpression(id, type);
        }
        return ctx;
    }

    addExpression(id: number, type: Type) {
        this.expressions.set(id, type);
    }

    getExpression(id: number) {
        return this.expressions.get(id);
    }

    hasExpression(id: number) {
        return this.expressions.has(id);
    }

    deleteExpression(id: number) {
        this.expressions.delete(id);
    }
}
