import { parse } from '../grammar';
import { loadCases } from '../../utils/loadCases';
import { resetNodeId } from '../ast';
import { ParseError } from '../../errors';

describe('Grammar', () => {
    beforeEach(() => {
        resetNodeId();
    });

    for (const r of loadCases(__dirname + '/cases/')) {
        it('should parse ' + r.name, () => {
            expect(parse(r.code)).toMatchSnapshot();
        });
    }

    for (const r of loadCases(__dirname + '/cases-failed/')) {
        it('should fail ' + r.name, () => {
            try {
                parse(r.code);
            } catch (e) {
                expect(e).toBeInstanceOf(ParseError);
                expect((e as ParseError).toString()).toMatchSnapshot();
                return;
            }
            throw new Error('Expected to fail');
        });
    }
});
