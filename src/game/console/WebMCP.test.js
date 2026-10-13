import registerWebMCP from './WebMCP';

function fixture(modern = false) {
  const tools = new Map();
  const context = {
    registerTool: jest.fn((tool, options) => {
      if (tools.has(tool.name)) throw new Error('Duplicate');
      tools.set(tool.name, tool);
      if (modern) options.signal.remove.push(() => tools.delete(tool.name));
      return modern ? Promise.resolve() : undefined;
    }),
    unregisterTool: modern ? undefined : jest.fn(name => tools.delete(name))
  };
  class AbortController {
    constructor() { this.signal = {remove: []}; }
    abort() { this.signal.remove.forEach(remove => remove()); }
  }
  const host = modern ? {document: {modelContext: context}, AbortController} : {navigator: {modelContext: context}};
  const api = {};
  const output = {log: jest.fn()};
  const bridge = registerWebMCP(host, api, output);
  const call = async (name, input) => {
    const response = await tools.get('sensuba_' + name).execute(input);
    return {response, value: JSON.parse(response.content[0].text)};
  };
  return {tools, context, host, api, output, bridge, call};
}

test('all commands are discoverable with explicit schemas and route through the public API', async () => {
  const f = fixture();
  expect(await f.bridge.ready).toBe(true);
  const cases = [
    ['view', {}, [false]], ['help', {}, []], ['read', {name: 'KOITO MINASE'}, ['KOITO MINASE']],
    ['follow', {}, [true]], ['follow', {enabled: false}, [false]], ['actions', {}, []],
    ['chat', {text: 'Bonjour !'}, ['Bonjour !']],
    ['targets', {card: 'hand:1'}, ['hand:1', []]],
    ['targets', {card: 'hand:1', selected: ['me:3']}, ['hand:1', ['me:3']]],
    ['play', {card: 'hand:1', targets: ['me:3', 'opponent:2']}, ['hand:1', ['me:3', 'opponent:2']]],
    ['attack', {card: 'me:1', target: 'opponent:9'}, ['me:1', 'opponent:9']],
    ['move', {card: 'me:1', target: 'me:2'}, ['me:1', 'me:2']],
    ['faculty', {card: 'me:7', number: 1}, ['me:7', 1, undefined]],
    ['secret', {card: 'me:1', setting: 'count', value: 0}, ['me:1', 'count', 0]],
    ['choose', {number: 1}, [1]], ['endTurn', {}, []], ['concede', {}, []]
  ];
  expect(f.tools.size).toBe(15);
  for (const [name, input, args] of cases) {
    f.api[name] = jest.fn(() => Promise.resolve({ok: true}));
    expect((await f.call(name, input)).value).toEqual({ok: true});
    expect(f.api[name]).toHaveBeenCalledWith(...args);
  }
  expect(f.tools.get('sensuba_view').annotations.readOnlyHint).toBe(true);
  expect(f.tools.get('sensuba_attack').annotations.readOnlyHint).toBe(false);
  expect(f.tools.get('sensuba_follow').annotations.readOnlyHint).toBe(false);
  expect(f.tools.get('sensuba_chat').annotations.readOnlyHint).toBe(false);
});

test('invalid inputs never reach game commands; failures have an MCP error result', async () => {
  const f = fixture();
  await f.bridge.ready;
  f.api.attack = jest.fn();
  f.api.choose = jest.fn();
  f.api.chat = jest.fn();
  for (const input of [{}, {text:123}, {text:''}, {text:'a'.repeat(121)}])
    expect((await f.call('chat', input)).response.isError).toBe(true);
  expect(f.api.chat).not.toHaveBeenCalled();
  for (const input of [null, [], {}, {card: 'me:0', target: 'opponent:1'}, {card: 'me:1', target: 'opponent:1', raw: true}])
    expect((await f.call('attack', input)).response.isError).toBe(true);
  expect((await f.call('choose', {number: 1.5})).response.isError).toBe(true);
  expect(f.api.attack).not.toHaveBeenCalled();
  expect(f.api.choose).not.toHaveBeenCalled();
  f.api.endTurn = () => ({ok: false, error: 'Choix requis'});
  expect((await f.call('endTurn', {})).value.error).toBe('Choix requis');
  f.api.endTurn = () => { throw new Error('PRIVATE INTERNAL DATA'); };
  const failure = await f.call('endTurn', {});
  expect(failure.response.isError).toBe(true);
  expect(JSON.stringify(failure)).not.toMatch(/PRIVATE/);
});

test('text results remain text, including async official card reads', async () => {
  const f = fixture();
  await f.bridge.ready;
  f.api.read = async () => 'Koito Minase\nFigure rouge, 1 mana';
  const response = await f.tools.get('sensuba_read').execute({name: 'koito minase'});
  expect(response.content[0].text).toBe('Koito Minase\nFigure rouge, 1 mana');
  expect(response.isError).toBe(false);
});

test('modern and legacy registrations are removed at game exit; captured tools become inert', async () => {
  for (const modern of [true, false]) {
    const f = fixture(modern);
    await f.bridge.ready;
    f.api.concede = jest.fn();
    const captured = f.tools.get('sensuba_concede');
    f.bridge.dispose();
    expect(f.tools.size).toBe(0);
    expect((await captured.execute({})).isError).toBe(true);
    expect(f.api.concede).not.toHaveBeenCalled();
  }
});

test('unavailable or rejected registration leaves console usable and cleans partial tools only', async () => {
  expect(await registerWebMCP({}, {}, console).ready).toBe(false);
  const f = fixture();
  const unrelated = {name: 'sensuba_help'};
  f.tools.set('sensuba_help', unrelated);
  expect(await f.bridge.ready).toBe(false);
  expect(Array.from(f.tools.values())).toEqual([unrelated]);
  expect(f.output.log).toHaveBeenCalledTimes(1);
});

test('leaving during async registration removes late tools without registering the rest', async () => {
  let finish;
  const tools = new Map();
  const context = {
    registerTool: tool => new Promise(resolve => { finish = () => { tools.set(tool.name, tool); resolve(); }; }),
    unregisterTool: name => tools.delete(name)
  };
  const bridge = registerWebMCP({navigator: {modelContext: context}}, {}, console);
  bridge.dispose();
  finish();
  expect(await bridge.ready).toBe(false);
  expect(tools.size).toBe(0);
});
