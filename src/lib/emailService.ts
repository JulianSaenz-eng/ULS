import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_7bhokvs';
const EMAILJS_TEMPLATE_ID = 'template_agshke9';
const EMAILJS_PUBLIC_KEY = 'kud-YUhL0SFvJ2nrc';

emailjs.init(EMAILJS_PUBLIC_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<void> => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }
    );
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};
