export default function InvitesIndex(){
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Invites</h1>
      <ul className="list-disc pl-5">
        <li><a className="underline" href="/dashboard/invites/new">Create Invite</a></li>
        <li><a className="underline" href="/dashboard/invites/resend">Resend Invite</a></li>
        <li><a className="underline" href="/dashboard/invites/revoke">Revoke Invite</a></li>
      </ul>
    </main>
  );
}
