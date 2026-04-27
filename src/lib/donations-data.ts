import { getPrisma } from "@/lib/prisma";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import {
  calendarMonthKey,
  formatMonthLabelPt,
  lastNCalendarMonths,
} from "@/lib/donations-months";

export type DonationPublicRow = {
  id: string;
  donorName: string;
  amount: number;
  donatedAt: string;
};

export type DonationMonthBucket = {
  key: string;
  label: string;
  total: number;
  donations: DonationPublicRow[];
};

export type DonationsTransparencyPayload = {
  months: DonationMonthBucket[];
  totalLast6Months: number;
  periodLabel: string;
};

function donationRowFromDb(r: {
  id: string;
  donorName: string;
  amount: { toString(): string };
  donatedAt: Date;
}): DonationPublicRow {
  return {
    id: r.id,
    donorName: r.donorName,
    amount: Number(r.amount.toString()),
    donatedAt: r.donatedAt.toISOString(),
  };
}

export async function getDonationsTransparencyPayload(): Promise<DonationsTransparencyPayload> {
  const tenant = await resolvePublicBlogTenant();
  const monthSpecs = lastNCalendarMonths(6);
  const first = monthSpecs[0]!;
  const last = monthSpecs[monthSpecs.length - 1]!;
  const rangeStart = new Date(first.year, first.month, 1);
  const rangeEnd = new Date(last.year, last.month + 1, 0, 23, 59, 59, 999);

  const periodLabel = `${formatMonthLabelPt(first.year, first.month)} – ${formatMonthLabelPt(last.year, last.month)}`;

  if (!tenant) {
    return {
      months: monthSpecs.map(({ year, month }) => ({
        key: calendarMonthKey(year, month),
        label: formatMonthLabelPt(year, month),
        total: 0,
        donations: [],
      })),
      totalLast6Months: 0,
      periodLabel,
    };
  }

  const rows = await getPrisma().donation.findMany({
    where: {
      tenantId: tenant.id,
      donatedAt: { gte: rangeStart, lte: rangeEnd },
    },
    orderBy: { donatedAt: "desc" },
    select: { id: true, donorName: true, amount: true, donatedAt: true },
  });

  const bucketMap = new Map<string, DonationPublicRow[]>();
  for (const m of monthSpecs) {
    bucketMap.set(calendarMonthKey(m.year, m.month), []);
  }

  for (const r of rows) {
    const d = r.donatedAt;
    const key = calendarMonthKey(d.getFullYear(), d.getMonth());
    const list = bucketMap.get(key);
    if (!list) continue;
    list.push(donationRowFromDb(r));
  }

  const months: DonationMonthBucket[] = monthSpecs.map(({ year, month }) => {
    const key = calendarMonthKey(year, month);
    const donations = [...(bucketMap.get(key) ?? [])].sort(
      (a, b) => new Date(b.donatedAt).getTime() - new Date(a.donatedAt).getTime(),
    );
    const total = donations.reduce((s, x) => s + x.amount, 0);
    return { key, label: formatMonthLabelPt(year, month), total, donations };
  });

  const totalLast6Months = months.reduce((s, m) => s + m.total, 0);
  return { months, totalLast6Months, periodLabel };
}
