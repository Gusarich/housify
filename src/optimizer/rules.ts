import { Action, ActionType } from '../housing/actions';
import { StatMode } from '../housing/util';
import { OptimizationRule } from './optimize';

function isStatReference(value: string): boolean {
    return value.startsWith('%');
}

export const optimizationRules: OptimizationRule[] = [
    {
        description: 'Set stat to constant then change it by another constant',
        apply(actions: Action[]): boolean {
            for (let i = 0; i < actions.length; ++i) {
                for (let j = i + 1; j < actions.length; ++j) {
                    const setStat = actions[i]!;
                    const changeStat = actions[j]!;

                    if (
                        (setStat.type === ActionType.CHANGE_STAT ||
                            setStat.type === ActionType.CHANGE_GLOBAL_STAT) &&
                        setStat.mode === StatMode.SET &&
                        changeStat.type === setStat.type &&
                        changeStat.stat === setStat.stat &&
                        !isStatReference(setStat.amount) &&
                        !isStatReference(changeStat.amount)
                    ) {
                        switch (changeStat.mode) {
                            case StatMode.INCREMENT:
                                setStat.amount = String(
                                    Number(setStat.amount) +
                                        Number(changeStat.amount),
                                );
                                break;
                            case StatMode.DECREMENT:
                                setStat.amount = String(
                                    Number(setStat.amount) -
                                        Number(changeStat.amount),
                                );
                                break;
                            case StatMode.SET:
                                setStat.amount = changeStat.amount;
                                break;
                            case StatMode.MULTIPLY:
                                setStat.amount = String(
                                    Number(setStat.amount) *
                                        Number(changeStat.amount),
                                );
                                break;
                            case StatMode.DIVIDE:
                                setStat.amount = String(
                                    Number(setStat.amount) /
                                        Number(changeStat.amount),
                                );
                                break;
                        }
                        actions.splice(j, 1);
                        return true;
                    }
                }
            }
            return false;
        },
    },
];
