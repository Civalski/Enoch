"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { requirePublicSiteMembersManager } from "@/lib/permissions/site-permissions";
import { ALL_SITE_PERMISSIONS } from "@/lib/permissions/site-permission-logic";
import type { SitePermission } from "@prisma/client";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { isMasterPanelTenantUserId } from "@/lib/auth/admin-master";
import {
  parseUserProfileExtras,
  readProfileExtrasForm,
  userProfileExtrasToPrismaData,
  type ParsedUserProfileExtras,
} from "@/lib/users/user-profile-extras";
import { createTenantMemberAction } from "./create-tenant-member";

const GENERIC = "Não foi possível concluir. Tente de novo.";

export type UpdatePermsResult = { ok: true } | { ok: false; message: string };

export async function updateMemberPermissionsAction(
  memberId: string,
  next: readonly SitePermission[],
): Promise<UpdatePermsResult> {
  const { tenantId, userId: actorId } = await requirePublicSiteMembersManager();
  const target = await getPrisma().tenantMember.findFirst({
    where: { id: memberId, tenantId },
  });
  if (!target) {
    return { ok: false, message: "Membro não encontrado." };
  }
  if (target.role === "OWNER" && isMasterPanelTenantUserId(target.userId)) {
    return { ok: false, message: "Não é possível alterar o proprietário principal (conta de painel)." };
  }
  const perms = next.filter((p) => ALL_SITE_PERMISSIONS.includes(p));
  if (target.role === "MEMBER" && perms.length === 0) {
    return { ok: false, message: "Um membro precisa de pelo menos uma permissão." };
  }
  await getPrisma().tenantMember.update({
    where: { id: memberId },
    data: { permissions: target.role === "ADMIN" ? [...ALL_SITE_PERMISSIONS] : perms },
  });
  revalidatePath("/app/usuarios");
  if (actorId === target.userId) {
    revalidatePath("/");
  }
  return { ok: true };
}

export async function removeMemberAction(memberId: string): Promise<UpdatePermsResult> {
  const { tenantId, userId: actorId } = await requirePublicSiteMembersManager();
  const target = await getPrisma().tenantMember.findFirst({
    where: { id: memberId, tenantId },
  });
  if (!target) {
    return { ok: false, message: "Membro não encontrado." };
  }
  if (isMasterPanelTenantUserId(target.userId)) {
    return { ok: false, message: "Não é possível remover o administrador máximo (conta de painel)." };
  }
  await getPrisma().tenantMember.delete({ where: { id: memberId } });
  revalidatePath("/app/usuarios");
  revalidatePath("/app");
  if (actorId === target.userId) {
    revalidatePath("/");
  }
  return { ok: true };
}

export type UsuariosMemberFormState = { ok: boolean; message: string };

export async function createMemberFormAction(
  _prev: UsuariosMemberFormState,
  formData: FormData,
): Promise<UsuariosMemberFormState> {
  const emailOrLogin = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const roleRaw = String(formData.get("role") ?? "MEMBER");
  const role = roleRaw === "ADMIN" ? "ADMIN" : "MEMBER";
  const permissions = ALL_SITE_PERMISSIONS.filter((p) => formData.get(`perm_${p}`) === "on");
  const parsed = parseUserProfileExtras(readProfileExtrasForm(formData));
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }
  const result = await createTenantMemberAction({
    emailOrLogin,
    password,
    role,
    permissions,
    profile: parsed.value,
  });
  if (result.ok) {
    return { ok: true, message: "Membro criado com sucesso." };
  }
  return { ok: false, message: result.message };
}

export async function updateMemberPermissionsFormAction(
  _prev: UsuariosMemberFormState,
  formData: FormData,
): Promise<UsuariosMemberFormState> {
  const memberId = String(formData.get("memberId") ?? "");
  const permissions = ALL_SITE_PERMISSIONS.filter((p) => formData.get(`perm_${p}`) === "on");
  const result = await updateMemberPermissionsAction(memberId, permissions);
  if (result.ok) {
    return { ok: true, message: "Permissões atualizadas." };
  }
  return { ok: false, message: result.message };
}

export async function removeMemberFormAction(
  _prev: UsuariosMemberFormState,
  formData: FormData,
): Promise<UsuariosMemberFormState> {
  const memberId = String(formData.get("memberId") ?? "");
  const result = await removeMemberAction(memberId);
  if (result.ok) {
    return { ok: true, message: "Membro removido." };
  }
  return { ok: false, message: result.message };
}

export async function updateMemberUserDataAction(
  memberId: string,
  profile: ParsedUserProfileExtras,
): Promise<UpdatePermsResult> {
  const { tenantId } = await requirePublicSiteMembersManager();
  const target = await getPrisma().tenantMember.findFirst({
    where: { id: memberId, tenantId },
  });
  if (!target) {
    return { ok: false, message: "Membro não encontrado." };
  }
  if (isMasterPanelTenantUserId(target.userId)) {
    return { ok: false, message: "Não é possível alterar dados do administrador máximo aqui." };
  }
  await getPrisma().userProfile.update({
    where: { id: target.userId },
    data: userProfileExtrasToPrismaData(profile),
  });
  revalidatePath("/app/usuarios");
  return { ok: true };
}

export async function updateMemberUserDataFormAction(
  _prev: UsuariosMemberFormState,
  formData: FormData,
): Promise<UsuariosMemberFormState> {
  const memberId = String(formData.get("memberId") ?? "");
  const parsed = parseUserProfileExtras(readProfileExtrasForm(formData));
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }
  const result = await updateMemberUserDataAction(memberId, parsed.value);
  if (result.ok) {
    return { ok: true, message: "Dados atualizados." };
  }
  return { ok: false, message: result.message };
}

export async function setMemberPasswordAction(
  memberId: string,
  password: string,
): Promise<UpdatePermsResult> {
  if (password.length < 8) {
    return { ok: false, message: "A senha deve ter pelo menos 8 caracteres." };
  }
  const { tenantId } = await requirePublicSiteMembersManager();
  const target = await getPrisma().tenantMember.findFirst({
    where: { id: memberId, tenantId },
  });
  if (!target) {
    return { ok: false, message: "Membro não encontrado." };
  }
  if (isMasterPanelTenantUserId(target.userId)) {
    return { ok: false, message: "Não é possível alterar a senha do administrador máximo aqui." };
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.updateUserById(target.userId, { password });
  if (error) {
    return { ok: false, message: error.message || GENERIC };
  }
  revalidatePath("/app/usuarios");
  return { ok: true };
}

export async function setMemberPasswordFormAction(
  _prev: UsuariosMemberFormState,
  formData: FormData,
): Promise<UsuariosMemberFormState> {
  const memberId = String(formData.get("memberId") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  if (password !== passwordConfirm) {
    return { ok: false, message: "As senhas não coincidem." };
  }
  const result = await setMemberPasswordAction(memberId, password);
  if (result.ok) {
    return { ok: true, message: "Senha alterada." };
  }
  return { ok: false, message: result.message };
}
