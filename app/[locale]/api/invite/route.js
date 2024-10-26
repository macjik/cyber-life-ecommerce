import 'server-only';
import db from '@/models/index';

const Invite = db.Invite;

export async function POST(req) {
  try {
    const { inviterId } = await req.json();

    const invite = await Invite.create({ inviter: inviterId });

    return new Response(JSON.stringify({ inviteCode: invite.inviteCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating invite:', error);

    return new Response(JSON.stringify({ error: 'Error creating invite' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
