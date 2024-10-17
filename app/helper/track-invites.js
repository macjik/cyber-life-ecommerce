const db = require('../../models/index');

db.sequelize.sync();
const { User, Invite } = db;

async function trackInviteChain(inviterId, visited = new Set()) {
  if (visited.has(inviterId)) {
    return [];
  }

  visited.add(inviterId);

  let directInvitees = await Invite.findAll({
    where: { inviter: inviterId },
    include: [
      { model: User, as: 'Invitee' },
      { model: User, as: 'Inviter' },
    ],
  });

  let allInvitees = [];

  for (let invite of directInvitees) {
    const invitee = invite.Invitee;

    if (!invitee) {
      console.warn(`Invite with code ${invite.inviteCode} has no invitee associated.`);
      continue;
    }

    allInvitees.push({
      invitee,
      inviteCode: invite.inviteCode,
      status: invite.status,
    });

    const nestedInvitees = await trackInviteChain(invitee.id, visited);

    allInvitees = allInvitees.concat(nestedInvitees);
  }

  return allInvitees;
}

module.exports = trackInviteChain;
