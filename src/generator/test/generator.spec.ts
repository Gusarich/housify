import { resetNodeId } from '../../grammar/ast';
import { parse } from '../../grammar/grammar';
import { CompilerContext } from '../../resolver/context';
import { resolveModule } from '../../resolver/resolve';
import { loadCases } from '../../utils/loadCases';
import { writeModule } from '../generate';

describe('Generator', () => {
    beforeEach(() => {
        resetNodeId();
    });

    for (const r of loadCases(__dirname + '/cases/')) {
        it('should generate ' + r.name, () => {
            const moduleAst = parse(r.code);
            const ctx = new CompilerContext();
            resolveModule(moduleAst, ctx);
            const module = writeModule(moduleAst, ctx);
            expect(module).toMatchSnapshot();
        });
    }

    for (const r of loadCases(__dirname + '/cases-failed/')) {
        it('should fail ' + r.name, () => {
            const moduleAst = parse(r.code);
            const ctx = new CompilerContext();
            resolveModule(moduleAst, ctx);
            expect(() => {
                writeModule(moduleAst, ctx);
            }).toThrowErrorMatchingSnapshot();
        });
    }
});
