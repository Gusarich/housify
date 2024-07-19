import { CompiledModule } from '../generator/generate';
import { Action } from '../housing/actions';
import { optimizationRules } from './rules';

export type OptimizationRule = {
    description: string;
    apply: (actions: Action[]) => boolean;
};

function tryApplyingOptimizationRules(module: CompiledModule) {
    let flag = false;
    for (const house of module.houses) {
        for (const handler of house.handlers) {
            for (const rule of optimizationRules) {
                flag ||= rule.apply(handler.actions);
            }
        }
    }
    return flag;
}

export function optimize(module: CompiledModule) {
    while (tryApplyingOptimizationRules(module)) {
        /* empty */
    }
}
