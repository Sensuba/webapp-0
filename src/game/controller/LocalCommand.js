// These settings have no server notification in the current protocol. Apply them
// immediately to the live board, then at the same position in the display stream.
export default function applyLocalCommand(board, command, player) {
  if (command.type === 'choose') board.areas[player].choosebox.close();
  if (command.type === 'param') {
    const card = board.find(command.id);
    if (!card) return;
    if (command.option === 'seteffect') card.secreteffect = command.value;
    if (command.option === 'setcount') card.secretcount = command.value;
  }
}
