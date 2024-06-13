import { auth } from "@/lib/auth";

export const session = async () => {
  const session = await auth()
  if (!session || !session.user || !session.user.id || !session.user.name)
    return {
      id: "",
      role: 'block'
    }
  return {
    id: session.user.id,
    role: session.user.name
  }
}
