'use server';

import db from '@/models/index';

const Invite = db.Invite;

export async function generateInviteLink(inviterId ) {
  try {
    const invite = await Invite.create({ inviter: inviterId });
    return { inviteCode: invite.inviteCode };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}
