const db = require('../../models/index');

const { User, Invite, Order } = db;

async function trackInviteChain(rootInviteId) {
  const invites = [];
  const visited = new Set();
  const queue = [rootInviteId];

  while (queue.length > 0) {
    const currentInviteId = queue.shift();

    if (visited.has(currentInviteId)) continue;

    visited.add(currentInviteId);

    const currentInvite = await Invite.findOne({ where: { id: currentInviteId } });
    if (!currentInvite) continue;

    invites.push(currentInvite);

    const invitesAsInviter = await Invite.findAll({ where: { inviter: currentInvite.invitee } });

    const invitesAsInvitee = await Invite.findAll({ where: { invitee: currentInvite.inviter } });

    for (let i = 0; i < invitesAsInviter.length; i++) {
      if (!visited.has(invitesAsInviter[i].id)) {
        queue.push(invitesAsInviter[i].id);
      }
    }

    for (let i = 0; i < invitesAsInvitee.length; i++) {
      if (!visited.has(invitesAsInvitee[i].id)) {
        queue.push(invitesAsInvitee[i].id);
      }
    }
  }
  return invites;
}

module.exports = trackInviteChain;
