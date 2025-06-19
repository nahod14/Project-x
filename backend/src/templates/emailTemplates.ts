interface EmailTemplateData {
  name?: string;
  verificationLink?: string;
  resetLink?: string;
}

export const emailTemplates = {
  verificationEmail: (data: EmailTemplateData) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Price Tracker!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering with Price Tracker. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationLink}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email Address
          </a>
        </div>
        <p>If you didn't create an account with Price Tracker, you can safely ignore this email.</p>
        <p>Best regards,<br>The Price Tracker Team</p>
      </div>
    `
  }),

  passwordResetEmail: (data: EmailTemplateData) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The Price Tracker Team</p>
      </div>
    `
  })
}; 