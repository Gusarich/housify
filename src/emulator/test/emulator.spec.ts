import { resetNodeId } from '../../grammar/ast';
import { loadCases } from '../../utils/loadCases';
import { resetTempId } from '../../generator/generate';
import { EmulatedHouse } from '../emulate';
import { compile } from '../../compile';
import { EventType } from '../../housing/events';

describe('Emulator', () => {
    const cases = loadCases(__dirname + '/cases/');

    beforeEach(() => {
        resetNodeId();
        resetTempId();
    });

    it('should emulate counter', () => {
        const module = compile(
            cases.find((c) => c.name === 'counter')!.code,
            false,
        );
        expect(module).toMatchSnapshot();
        const house = new EmulatedHouse(module.houses[0]!);

        house.emit(EventType.JOIN, 'player1');
        house.emit(EventType.JOIN, 'player2');
        house.emit(EventType.JOIN, 'player3');
        house.emit(EventType.JOIN, 'player1');
        house.emit(EventType.JOIN, 'player2');
        house.emit(EventType.JOIN, 'player3');

        const actions = house.collect();
        expect(actions).toHaveLength(0);
        expect(house.globalStat('counter')).toBe(6);
        expect(house.playerStat('player1', 'counter')).toBe(2);
        expect(house.playerStat('player2', 'counter')).toBe(2);
        expect(house.playerStat('player3', 'counter')).toBe(2);
        expect(house.playerStat('player4', 'counter')).toBe(0);
    });
});