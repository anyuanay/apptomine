import type { License } from '@/types/app';

export type LicenseTier = 'permissive' | 'copyleft' | 'unknown';

export interface LicenseInfo {
  tier: LicenseTier;
  /** Text to show in the badge ("MIT", "GPL-3.0", "No license"…). */
  label: string;
  /** Hover explanation of what the license means for cloning/customizing. */
  tooltip: string;
  /** Tailwind classes for the full badge (bg + text + border). */
  badgeClass: string;
  /** Tailwind classes for a small status dot. */
  dotClass: string;
}

const PERMISSIVE = new Set([
  'MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', '0BSD', 'Unlicense',
  'ISC', 'CC0-1.0', 'WTFPL', 'Zlib', 'BSL-1.0', 'MIT-0',
]);

/** SPDX id reported by GitHub when a repo has no detected license. */
const NO_LICENSE = new Set(['', 'Unknown', 'NOASSERTION']);

function classify(spdx: string): LicenseTier {
  if (NO_LICENSE.has(spdx)) return 'unknown';
  if (PERMISSIVE.has(spdx)) return 'permissive';

  // Copyleft / share-alike / non-commercial families (prefix match covers the
  // -only / -or-later and versioned variants like GPL-3.0-or-later, CC-BY-NC-SA-4.0).
  if (/^(A?GPL|LGPL|MPL|EPL|EUPL|OSL|CDDL|CC-BY-SA|CC-BY-NC|CC-BY-ND|SSPL|CPAL|MS-RL)/i.test(spdx)) {
    return 'copyleft';
  }

  // Anything else we don't explicitly recognize → treat as unknown so the user
  // is prompted to check it rather than assuming it's safe to reuse.
  return 'unknown';
}

export function getLicenseInfo(license: License): LicenseInfo {
  const spdx = (license ?? '').trim();
  const tier = classify(spdx);

  if (tier === 'permissive') {
    return {
      tier,
      label: spdx,
      tooltip: `${spdx}: permissive license — you can freely clone, modify, and redistribute.`,
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      dotClass: 'bg-emerald-400',
    };
  }

  if (tier === 'copyleft') {
    return {
      tier,
      label: spdx,
      tooltip: `${spdx}: copyleft / restrictive license — derivative works may have to keep the same license. Review the terms before reusing.`,
      badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      dotClass: 'bg-amber-400',
    };
  }

  const known = !NO_LICENSE.has(spdx);
  return {
    tier,
    label: known ? spdx : 'No license',
    tooltip: known
      ? `${spdx}: license terms not recognized — review them before cloning or customizing.`
      : 'No open-source license detected — the code is "all rights reserved" by default. You may not have the legal right to clone, modify, or redistribute it.',
    badgeClass: 'bg-red-500/15 text-red-400 border border-red-500/30',
    dotClass: 'bg-red-400',
  };
}
