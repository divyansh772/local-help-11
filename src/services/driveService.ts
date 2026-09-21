import { Booking } from '../types';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

export const generateReceiptHtml = (booking: Booking): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Local Help Receipt - ${booking.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; background: #f8fafc; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: 800; color: #0f172a; }
    .logo span { color: #2563eb; }
    .badge { background: #dcfce7; color: #15803d; font-weight: 600; padding: 4px 12px; border-radius: 9999px; font-size: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; font-size: 14px; }
    .label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-weight: 600; color: #0f172a; margin-top: 2px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .table th { text-align: left; background: #f8fafc; padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase; }
    .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .total-row { font-size: 16px; font-weight: 700; color: #0f172a; }
    .warranty { background: #eff6ff; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 13px; color: #1e40af; }
    .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Local<span>Help</span></div>
      <div class="badge">Verified Service Booking</div>
    </div>

    <div class="info-grid">
      <div>
        <div class="label">Booking ID</div>
        <div class="value">${booking.id}</div>
      </div>
      <div>
        <div class="label">Date & Time</div>
        <div class="value">${booking.date} at ${booking.timeSlot}</div>
      </div>
      <div>
        <div class="label">Assigned Professional</div>
        <div class="value">${booking.workerName} (${booking.workerCategory.toUpperCase()})</div>
      </div>
      <div>
        <div class="label">Service Start OTP</div>
        <div class="value" style="color: #2563eb; font-size: 18px; letter-spacing: 2px;">${booking.otp}</div>
      </div>
      <div style="grid-column: span 2;">
        <div class="label">Service Address</div>
        <div class="value">${booking.address.flatNumber}, ${booking.address.street}, ${booking.address.city} - ${booking.address.pincode}</div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${booking.serviceName}</strong><br><span style="color: #64748b; font-size: 12px;">Standard Certified On-site Work</span></td>
          <td style="text-align: right;">₹${booking.pricing.basePrice.toFixed(2)}</td>
        </tr>
        ${booking.pricing.partsAddonPrice > 0 ? `
        <tr>
          <td>Standard Spare Parts / Consumables Kit</td>
          <td style="text-align: right;">₹${booking.pricing.partsAddonPrice.toFixed(2)}</td>
        </tr>` : ''}
        <tr>
          <td>Hygiene, Sanitation & Insurance Fee</td>
          <td style="text-align: right;">₹${booking.pricing.safetyFee.toFixed(2)}</td>
        </tr>
        ${booking.pricing.discount > 0 ? `
        <tr style="color: #16a34a;">
          <td>Promotional Discount</td>
          <td style="text-align: right;">-₹${booking.pricing.discount.toFixed(2)}</td>
        </tr>` : ''}
        <tr class="total-row">
          <td>Total Paid / Payable</td>
          <td style="text-align: right;">₹${booking.pricing.total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="warranty">
      🛡️ <strong>30-Day Local Help Service Guarantee:</strong> All repairs and services conducted by verified pros include a 30-day revisit warranty and up to ₹10,000 damage cover. Keep this digital receipt for hassle-free claims.
    </div>

    <div class="footer">
      Generated on ${new Date(booking.createdAt).toLocaleString()} • Local Help Home Services Network
    </div>
  </div>
</body>
</html>`;
};

export const uploadReceiptToDrive = async (
  booking: Booking,
  accessToken: string
): Promise<{ fileId: string; webViewLink?: string; fileName: string }> => {
  const fileName = `LocalHelp_Receipt_${booking.id}.html`;
  const fileContent = generateReceiptHtml(booking);

  const metadata = {
    name: fileName,
    mimeType: 'text/html',
    description: `Local Help Home Service receipt for ${booking.serviceName} by ${booking.workerName}`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/html\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Drive upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return {
    fileId: data.id,
    webViewLink: data.webViewLink,
    fileName,
  };
};

export const fetchUrbanFixDriveFiles = async (
  accessToken: string
): Promise<DriveFileItem[]> => {
  const query = encodeURIComponent("(name contains 'LocalHelp' or name contains 'UrbanFix') and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,createdTime,size)&orderBy=createdTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Drive list failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.files || [];
};
