import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  slotCode: string;
  plate: string;
  timestamp: string;
}

const sendSlotApprovalEmail = async ({ to, slotCode, plate, timestamp }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"Vehicle Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Parking Slot Request Approved',
      html: `
        <h2>Parking Slot Request Approved</h2>
        <p>Your request for a parking slot has been approved. Below are the details:</p>
        <ul>
          <li><strong>Slot Number:</strong> ${slotCode}</li>
          <li><strong>Vehicle Plate:</strong> ${plate}</li>
          <li><strong>Approval Timestamp:</strong> ${timestamp}</li>
        </ul>
        <p>Please contact support if you have any questions.</p>
        <p>Best regards,<br>Vehicle Management System Team</p>
      `,
    });
    console.log(`Approval email sent to ${to}`);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw new Error('Failed to send approval email');
  }
};

export { sendSlotApprovalEmail };