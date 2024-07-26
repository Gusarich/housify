import { resolveModule } from '../resolve';
import { loadCases } from '../../utils/loadCases';
import { resetNodeId } from '../../grammar/ast';
import { parse } from '../../grammar/grammar';
import { CompilerContext } from '../context';
import {
    CompilationError,
    ConstantEvaluationError,
    ResolveError,
} from '../../errors';

describe('Resolver', () => {
    beforeEach(() => {
        resetNodeId();
    });

    for (const r of loadCases(__dirname + '/cases/')) {
        it('should resolve ' + r.name, () => {
            const moduleAst = parse(r.code);
            const ctx = new CompilerContext();
            resolveModule(moduleAst, ctx);
            expect(ctx).toMatchSnapshot();
        });
    }

    for (const r of loadCases(__dirname + '/cases-failed/')) {
        it('should fail ' + r.name, () => {
            const moduleAst = parse(r.code);
            const ctx = new CompilerContext();
            try {
                resolveModule(moduleAst, ctx);
            } catch (e) {
                try {
                    expect(e).toBeInstanceOf(ResolveError);
                } catch {
                    expect(e).toBeInstanceOf(ConstantEvaluationError);
                }
                expect((e as CompilationError).toString()).toMatchSnapshot();
                return;
            }
            throw new Error('Expected to fail');
        });
    }
});
