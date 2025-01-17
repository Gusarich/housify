import { EventType } from '../housing/events';
import { Type } from './type';

export type Variable = {
    type: Type;
    constant: boolean;
};

export class StatementContext {
    variables: Map<string, Variable>;
    alwaysReturns: boolean;
    expectedReturnType: Type;

    constructor(expectedReturnType?: Type) {
        this.variables = new Map();
        this.alwaysReturns = false;
        this.expectedReturnType = expectedReturnType ?? { type: 'void' };
    }

    clone() {
        const sctx = new StatementContext();
        for (const [name, variable] of this.variables) {
            sctx.addVariable(name, variable);
        }
        sctx.alwaysReturns = this.alwaysReturns;
        sctx.expectedReturnType = this.expectedReturnType;
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

    setAlwaysReturns() {
        this.alwaysReturns = true;
    }

    unsetAlwaysReturns() {
        this.alwaysReturns = false;
    }

    isAlwaysReturns() {
        return this.alwaysReturns;
    }
}

export type House = {
    globalStats: {
        name: string;
        type: Type;
    }[];
    playerStats: {
        name: string;
        type: Type;
    }[];
    handlers: EventType[];
};

export type StaticConstant = {
    type: Type;
    value: string;
};

export type InlineFunction = {
    type: Type;
    parameters: {
        name: string;
        type: Type;
    }[];
    astId: number;
};

export class CompilerContext {
    expressions: Map<number, Type>;
    houses: Map<string, House>;
    types: Map<string, Type>;
    staticConstants: Map<string, StaticConstant>;
    inlineFunctions: Map<string, InlineFunction>;

    constructor() {
        this.expressions = new Map();
        this.houses = new Map();
        this.types = new Map();
        this.staticConstants = new Map();
        this.inlineFunctions = new Map();
    }

    clone() {
        const ctx = new CompilerContext();
        for (const [id, type] of this.expressions) {
            ctx.addExpression(id, type);
        }
        for (const [name, house] of this.houses) {
            ctx.addHouse(name, house);
        }
        for (const [name, type] of this.types) {
            ctx.types.set(name, type);
        }
        for (const [name, constant] of this.staticConstants) {
            ctx.addStaticConstant(name, constant);
        }
        for (const [name, type] of this.inlineFunctions) {
            ctx.inlineFunctions.set(name, type);
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

    addStaticConstant(name: string, constant: StaticConstant) {
        this.staticConstants.set(name, constant);
    }

    getStaticConstant(name: string) {
        return this.staticConstants.get(name);
    }

    hasStaticConstant(name: string) {
        return this.staticConstants.has(name);
    }

    deleteStaticConstant(name: string) {
        this.staticConstants.delete(name);
    }

    addInlineFunction(name: string, func: InlineFunction) {
        this.inlineFunctions.set(name, func);
    }

    getInlineFunction(name: string) {
        return this.inlineFunctions.get(name);
    }

    hasInlineFunction(name: string) {
        return this.inlineFunctions.has(name);
    }

    deleteInlineFunction(name: string) {
        this.inlineFunctions.delete(name);
    }
}
