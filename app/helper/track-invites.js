const db = require('../../models/index');

const { User, Invite, Order } = db;

async function trackInviteChain(inviterId, visited = new Set()) {
  if (visited.has(inviterId)) {
    return [];
  }

  visited.add(inviterId);

  let directInvites = await Invite.findAll({
    where: { inviter: inviterId },
    include: [{ model: User, as: 'Invitee' }]
  });

  let allInvites = [];

  for (let invite of directInvites) {
    const invitee = invite.Invitee;

    if (!invitee) continue;

    // Fetch orders related to this invitee
    let relatedOrders = await Order.findAll({
      where: { userId: invitee.id }
    });

    allInvites = allInvites.concat(relatedOrders);

    const nestedInvites = await trackInviteChain(invitee.id, visited);
    allInvites = allInvites.concat(nestedInvites);
  }

  return allInvites;
}


module.exports = trackInviteChain;
