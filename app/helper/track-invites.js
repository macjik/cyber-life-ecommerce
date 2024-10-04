const db = require('../../models/index');

db.sequelize.sync();
const { User, Invite } = db;

async function trackInviteChain(inviterId, visited = new Set()) {
  if (visited.has(inviterId)) {
    // If this inviter has already been processed, avoid reprocessing
    return [];
  }

  visited.add(inviterId); // Mark the inviter as processed

  let directInvitees = await Invite.findAll({
    where: { inviter: inviterId }, // Ensure you're querying by inviterId
    include: [
      { model: User, as: 'Invitee' }, // Ensure alias matches what is in the model
      { model: User, as: 'Inviter' },
    ],
  });

  let allInvitees = [];

  for (let invite of directInvitees) {
    const invitee = invite.Invitee;

    // Check if invitee exists before trying to access its properties
    if (!invitee) {
      console.warn(`Invite with code ${invite.inviteCode} has no invitee associated.`);
      continue; // Skip this iteration if invitee is null
    }

    allInvitees.push({
      invitee,
      inviteCode: invite.inviteCode,
      status: invite.status,
    });

    // Recursively track invitees of the current invitee by passing their ID
    const nestedInvitees = await trackInviteChain(invitee.id, visited); // Pass invitee.id, not the entire object

    // Concatenate nested invitees to the main list
    allInvitees = allInvitees.concat(nestedInvitees);
  }

  return allInvitees;
}

module.exports = trackInviteChain;
