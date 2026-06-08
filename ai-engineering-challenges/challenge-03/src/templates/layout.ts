const BRAND = {
  primary: '#2563EB',
  secondary: '#10B981',
  warning: '#EF4444',
  text: '#1F2937',
  muted: '#6B7280',
  background: '#F3F4F6',
  white: '#FFFFFF',
  border: '#E5E7EB',
} as const;

interface LayoutOptions {
  accentColor?: string;
  preheader?: string;
}

export function emailLayout(content: string, options: LayoutOptions = {}): string {
  const accent = options.accentColor ?? BRAND.primary;
  const preheader = options.preheader ?? '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Papaya Insurance</title>
  <!--[if mso]><style type="text/css">body, table, td { font-family: Arial, sans-serif !important; }</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.text};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.background};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:${BRAND.white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg, ${accent} 0%, ${BRAND.primary} 100%);padding:28px 32px;text-align:center;">
              <div style="font-size:24px;font-weight:700;color:${BRAND.white};letter-spacing:0.02em;">Papaya Insurance</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.9);margin-top:6px;">Caring for your health, every step of the way</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background-color:#F9FAFB;border-top:1px solid ${BRAND.border};">
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:${BRAND.muted};">
                Need help? Contact our support team at
                <a href="mailto:support@papaya.insurance" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">support@papaya.insurance</a>
                or call <strong style="color:${BRAND.text};">1800-PAPAYA</strong>.
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9CA3AF;">
                Papaya Insurance · 123 Wellness Avenue, Bangkok<br />
                You received this email because you have an active claim with us.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:${BRAND.text};">${text}</p>`;
}

export function greeting(): string {
  return paragraph(`Hi {{member_name}},`);
}

export function infoBox(content: string, accentColor: string = BRAND.primary): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;background-color:#F8FAFC;border:1px solid ${BRAND.border};border-left:4px solid ${accentColor};border-radius:8px;">
    <tr>
      <td style="padding:20px 24px;">
        ${content}
      </td>
    </tr>
  </table>`;
}

export function infoRow(label: string, value: string): string {
  return `<p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:${BRAND.text};">
    <span style="display:inline-block;min-width:140px;color:${BRAND.muted};">${label}</span>
    <strong>{{${value}}}</strong>
  </p>`;
}

export function highlightAmount(label: string, amountVar: string, color: string = BRAND.secondary): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
    <tr>
      <td align="center" style="padding:24px;background-color:#ECFDF5;border:2px solid ${color};border-radius:12px;">
        <div style="font-size:14px;color:${BRAND.muted};margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">${label}</div>
        <div style="font-size:36px;font-weight:700;color:${color};line-height:1.2;">{{${amountVar}}}</div>
      </td>
    </tr>
  </table>`;
}

export function stepsList(title: string, items: string[]): string {
  const listItems = items
    .map(
      (item, index) =>
        `<tr>
          <td style="padding:8px 0;vertical-align:top;width:28px;font-size:15px;font-weight:700;color:${BRAND.primary};">${index + 1}.</td>
          <td style="padding:8px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">${item}</td>
        </tr>`,
    )
    .join('');

  return `<div style="margin:24px 0;">
    <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:${BRAND.text};">${title}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${listItems}</table>
  </div>`;
}

export { BRAND };
