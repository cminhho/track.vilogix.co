export interface FaqItem {
  question: string
  answer: string
}

export const HOME_FAQS: readonly FaqItem[] = [
  {
    question: 'Where can I find my VI LOGIX tracking number?',
    answer: 'Your VI LOGIX tracking number is provided with the shipment confirmation or progress message. It normally contains letters, numbers, and hyphens. Ask your VI LOGIX contact if you have not received one.',
  },
  {
    question: 'Why is my tracking number not showing a shipment?',
    answer: 'Check that every letter, number, and hyphen matches the tracking number you received. A newly created shipment may not appear until its public record is available. Contact VI LOGIX if the number remains unavailable.',
  },
  {
    question: 'How often are tracking updates added?',
    answer: 'Updates are added when VI LOGIX confirms a handling milestone or receives an applicable international movement update. Timing varies by shipment, route, and provider, so tracking is not a continuous live location feed.',
  },
  {
    question: 'Does tracking show a guaranteed delivery date?',
    answer: 'No. Tracking shows confirmed shipment milestones. Delivery timing can change with the route, provider, customs processing, destination clearance, or other conditions outside the Vietnam-side handling process.',
  },
]
