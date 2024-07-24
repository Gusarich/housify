import { AstExpression } from '../grammar/ast';
import { EventType } from '../housing/events';
import { Type } from './type';

export type Variable = {
    type: Type;
    constant: boolean;
};

export class StatementContext {
    variables: Map<string, Variable>;
    types: Map<string, Type>;

    constructor() {
        this.variables = new Map();
        this.types = new Map();
    }

    clone() {
        const sctx = new StatementContext();
        for (const [name, variable] of this.variables) {
            sctx.addVariable(name, variable);
        }
        for (const [name, type] of this.types) {
            sctx.addType(name, type);
        }
        return sctx;
    }

    addVariable(name: string, type: Variable) {
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

export type House = {
    globalStats: {
        name: string;
        type: Type;
        defaultValue?: AstExpression;
    }[];
    playerStats: {
        name: string;
        type: Type;
        defaultValue?: AstExpression;
    }[];
    handlers: EventType[];
};

export class CompilerContext {
    expressions: Map<number, Type>;
    houses: Map<string, House>;

    constructor() {
        this.expressions = new Map();
        this.houses = new Map();
    }

    clone() {
        const ctx = new CompilerContext();
        for (const [id, type] of this.expressions) {
            ctx.addExpression(id, type);
        }
        for (const [name, house] of this.houses) {
            ctx.addHouse(name, house);
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

    addHouse(name: string, house: House) {
        this.houses.set(name, house);
    }

    getHouse(name: string) {
        return this.houses.get(name);
    }

    hasHouse(name: string) {
        return this.houses.has(name);
    }

    deleteHouse(name: string) {
        this.houses.delete(name);
    }
}
