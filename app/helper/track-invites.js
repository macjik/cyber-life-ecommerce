const db = require('../../models/index');
const { Invite } = db;

async function trackInviteChain(rootInviteId) {
  const invites = [];
  const visited = new Set();
  const queue = [rootInviteId];

  while (queue.length > 0) {
    const currentInviteId = queue.shift();

    if (visited.has(currentInviteId)) continue;
    visited.add(currentInviteId);

    const currentInvite = await Invite.findOne({ where: { id: currentInviteId } });
    if (!currentInvite || currentInvite.invitee === null) continue;

    invites.push(currentInvite);

    const relatedInvites = await Invite.findAll({
      where: {
        inviter: currentInvite.invitee,
        invitee: { [db.Sequelize.Op.ne]: null },
      },
    });

    for (let invite of relatedInvites) {
      if (!visited.has(invite.id)) {
        queue.push(invite.id);
      }
    }
  }

  return invites;
}

module.exports = trackInviteChain;
