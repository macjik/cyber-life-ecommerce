import 'server-only';
import db from '@/models/index';

const Invite = db.Invite;

export async function POST(req) {
  try {
    const { inviterId, uid } = await req.json();

    if (!inviterId || !uid) {
      return new Response(JSON.stringify({ error: 'Missing inviterId or uid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const invite = await Invite.create({ inviter: inviterId, inviteCode: uid });

    return new Response(JSON.stringify({ inviteCode: invite.inviteCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating invite:', error);

    return new Response(JSON.stringify({ error: 'Server error creating invite' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
