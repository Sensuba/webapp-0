import Sequencer from './Sequencer';

beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('legacy replay dispatch preserves notification order and before/after animation timing', () => {
  const calls = [];
  const sequence = new Sequencer({}, {}, n => calls.push(n.type));
  sequence.notifToAnim = n => n.type === 'before' || n.type === 'after' ? {
    sync: true, before: n.type === 'before', start: done => setTimeout(done, 400)
  } : null;
  sequence.setState(3);
  sequence.add({type: 'before'});
  sequence.add({type: 'after'});
  sequence.add({type: 'last'});
  expect(calls).toEqual([]);
  sequence.setState(3); // Changing state must not skip an active animation.
  expect(calls).toEqual([]);
  jest.runTimersToTime(400);
  expect(calls).toEqual(['before', 'after']);
  jest.runTimersToTime(400);
  expect(calls).toEqual(['before', 'after', 'last']);
});

test('display stream waits for async model computation before constructing the next animation', () => {
  const applied = [];
  let complete;
  const sequence = new Sequencer({}, {}, (n, done) => { applied.push(n.type); complete = done; }, true);
  sequence.notifToAnim = jest.fn(() => null);
  sequence.setState(3);
  sequence.add({type: 'identify'});
  sequence.add({type: 'summon'});
  expect(applied).toEqual(['identify']);
  expect(sequence.notifToAnim).toHaveBeenCalledTimes(1);
  complete();
  expect(applied).toEqual(['identify', 'summon']);
  expect(sequence.notifToAnim).toHaveBeenCalledTimes(2);
  complete();
  expect(sequence.current).toBe(null);
});

test('instant initial resync runs before intro and disposed sequences ignore delayed callbacks', () => {
  const dispatch = jest.fn((n, done) => done());
  const sequence = new Sequencer({}, {}, dispatch, true);
  sequence.add({type: 'start'}, true);
  expect(dispatch).toHaveBeenCalledTimes(1);
  sequence.notifToAnim = () => ({sync: true, before: true, start: done => setTimeout(done, 400)});
  sequence.setState(3);
  sequence.add({type: 'destroycard'});
  sequence.dispose();
  jest.runAllTimers();
  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(sequence.queue).toEqual([]);
});
