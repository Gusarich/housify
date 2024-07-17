import { resolveModule } from '../resolve';
import { loadCases } from '../../utils/loadCases';
import { resetNodeId } from '../../grammar/ast';
import { parse } from '../../grammar/grammar';
import { CompilerContext } from '../context';

describe('Grammar', () => {
    beforeEach(() => {
        resetNodeId();
    });

    for (const r of loadCases(__dirname + '/cases/')) {
        it('should parse ' + r.name, () => {
            const moduleAst = parse(r.code);
            expect(moduleAst).toMatchSnapshot();
            const ctx = new CompilerContext();
            resolveModule(moduleAst, ctx);
            expect(ctx).toMatchSnapshot();
        });
    }

    for (const r of loadCases(__dirname + '/cases-failed/')) {
        it('should fail ' + r.name, () => {
            const moduleAst = parse(r.code);
            const ctx = new CompilerContext();
            expect(() => {
                resolveModule(moduleAst, ctx);
            }).toThrowErrorMatchingSnapshot();
        });
    }
});
