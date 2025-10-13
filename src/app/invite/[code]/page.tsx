import InviteRedeemer from './InviteRedeemer'

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <InviteRedeemer code={code} />
}
