export function websiteMail(username: string, message: string) {
  return `
            <h3>Message From: ${username},</h3>
            <p>${message}</p>
  `;
}
