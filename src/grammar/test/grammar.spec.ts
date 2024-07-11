import { parse } from '../grammar';
import { loadCases } from '../../utils/loadCases';
import { resetNodeId } from '../ast';

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
            expect(() => parse(r.code)).toThrowErrorMatchingSnapshot();
        });
    }
});
