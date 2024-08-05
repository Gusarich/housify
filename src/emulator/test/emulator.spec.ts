import { resetNodeId } from '../../grammar/ast';
import { loadCases } from '../../utils/loadCases';
import { resetTempId } from '../../generator/generate';
import { EmulatedHouse as OriginalEmulatedHouse } from '../emulate';
import { compile } from '../../compile';
import { EventType } from '../../housing/events';

expect.extend({
    toNotStartWith(received, prefix) {
        const pass = !received.startsWith(prefix);
        if (pass) {
            return {
                message: () =>
                    `expected ${received} not to start with ${prefix}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${received} to not start with ${prefix}`,
                pass: false,
            };
        }
    },
});

class EmulatedHouse extends OriginalEmulatedHouse {
    emit(eventType: EventType, player: string) {
        super.emit(eventType, player);
        this.expectNoTemporaryStats();
    }

    expectNoTemporaryStats() {
        for (const [stat, value] of this.globalStats) {
            if (stat.startsWith('$') && value !== 0) {
                throw new Error(`Global stat ${stat} is temporary`);
            }
        }
        for (const [name, player] of this.playerStats) {
            for (const [stat, value] of player) {
                if (stat.startsWith('$') && value !== 0) {
                    throw new Error(`Player stat ${name}.${stat} is temporary`);
                }
            }
        }
    }
}

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

        house.reset();

        house.emit(EventType.JOIN, 'player1');
        const actions2 = house.collect();
        expect(actions2).toHaveLength(0);
        expect(house.globalStat('counter')).toBe(1);
        expect(house.playerStat('player1', 'counter')).toBe(1);
    });

    it('should emulate arithmetics', () => {
        const module = compile(
            cases.find((c) => c.name === 'arithmetics')!.code,
            false,
        );
        const house = new EmulatedHouse(module.houses[0]!);

        house.emit(EventType.JOIN, 'player1');
        expect(house.globalStat('counter')).toBe(23);

        house.emit(EventType.JOIN, 'player2');
        expect(house.globalStat('counter')).toBe(115);

        house.emit(EventType.JOIN, 'player3');
        expect(house.globalStat('counter')).toBe(483);

        const actions = house.collect();
        expect(actions).toHaveLength(0);
    });

    it('should emulate conditions', () => {
        const module = compile(
            cases.find((c) => c.name === 'conditions')!.code,
            false,
        );
        const house = new EmulatedHouse(module.houses[0]!);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(123);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(456);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(789);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(0);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(123);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(456);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(789);

        house.emit(EventType.JOIN, 'player');
        expect(house.globalStat('counter')).toBe(0);

        const actions = house.collect();
        expect(actions).toHaveLength(0);
    });

    it('should emulate multiple handlers', async () => {
        const module = compile(
            cases.find((c) => c.name === 'multiple-handlers')!.code,
            false,
        );
        const house = new EmulatedHouse(module.houses[0]!);

        house.emit(EventType.JOIN, 'player1');
        expect(house.globalStat('counter')).toBe(1);

        house.emit(EventType.JOIN, 'player2');
        expect(house.globalStat('counter')).toBe(2);

        house.emit(EventType.JOIN, 'player3');
        expect(house.globalStat('counter')).toBe(3);

        house.emit(EventType.QUIT, 'player1');
        expect(house.globalStat('counter')).toBe(2);

        house.emit(EventType.QUIT, 'player2');
        expect(house.globalStat('counter')).toBe(1);

        house.emit(EventType.QUIT, 'player3');
        expect(house.globalStat('counter')).toBe(0);

        const actions = house.collect();
        expect(actions).toHaveLength(0);
    });

    it('should emulate booleans', async () => {
        const module = compile(
            cases.find((c) => c.name === 'booleans')!.code,
            false,
        );
        const house = new EmulatedHouse(module.houses[0]!);

        house.emit(EventType.JOIN, 'player');

        expect(house.globalStat('x')).toBe(1);
        expect(house.globalStat('y')).toBe(1);
        expect(house.globalStat('z')).toBe(0);
        expect(house.globalStat('a')).toBe(1);
        expect(house.globalStat('b')).toBe(0);
        expect(house.globalStat('c')).toBe(1);
        expect(house.globalStat('d')).toBe(1);
        expect(house.globalStat('e')).toBe(0);
        expect(house.globalStat('f')).toBe(1);
        expect(house.globalStat('g')).toBe(1);

        const actions = house.collect();
        expect(actions).toHaveLength(0);
    });
});
