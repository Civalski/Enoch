"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { requireSitePermission } from "@/lib/permissions/site-permissions";

export async function markContactMessageReadAction(messageId: string) {
  const { tenantId } = await requireSitePermission("CONTACT_INBOX");
  await getPrisma().contactMessage.updateMany({
    where: { id: messageId, tenantId },
    data: { readAt: new Date() },
  });
  revalidatePath("/app/email");
  revalidatePath("/contato");
}
