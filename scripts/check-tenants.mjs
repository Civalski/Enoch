const url = "https://onpbpjpicxahnwrdzrbx.supabase.co/rest/v1";
const headers = {
  "apikey": "sb_publishable_1i8IS4kZ0Tqct0JWzezwsw_ubc8S7_3",
  "Authorization": "Bearer sb_secret_beutZrwLiqFkS0c6C5TBYA_AcfXPVJy"
};

async function main() {
  let res = await fetch(`${url}/Tenant?select=*`, { headers });
  console.log("Tenants:", await res.json());

  res = await fetch(`${url}/TenantMember?select=*`, { headers });
  console.log("Tenant Members:", await res.json());
}
main().catch(console.error);
