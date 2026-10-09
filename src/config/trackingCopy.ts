import type { TrackingLocale } from '../types/tracking'

/**
 * Customer-facing copy for the lean tracking surface (home, unavailable, 404, header, footer).
 * Voice: short, direct, no vendor-specific helper text (see HomePage.test.tsx). The locale comes
 * from `?lang=vi|en`; canonical URLs and metadata stay on the English default.
 */
export interface LeanTrackingCopy {
  skipToContent: string
  language: { label: string; en: string; vi: string }
  header: { quote: string; quoteLabel: string; help: string; helpMessage: string; menuOpen: string; menuClose: string }
  home: {
    eyebrow: string
    title: string
    intro: string
    formEyebrow: string
    formTitle: string
    label: string
    submit: string
    note: string
    errorEmpty: string
    errorInvalid: string
    pageTitle: string
    pageDescription: string
  }
  unavailable: {
    eyebrow: string
    title: string
    body: string
    back: string
    support: string
  }
  notFound: {
    eyebrow: string
    title: string
    body: string
    back: string
  }
  footer: { tagline: string; website: string; websiteLabel: string; help: string }
  embed: { loading: string; errorTitle: string; errorBody: string; retry: string; support: string }
  supportMessage: string
}

export const LEAN_TRACKING_COPY: Record<TrackingLocale, LeanTrackingCopy> = {
  en: {
    skipToContent: 'Skip to main content',
    language: { label: 'Language', en: 'EN', vi: 'VI' },
    header: {
      quote: 'Contact us',
      quoteLabel: 'Contact VI LOGIX',
      help: 'Ask about this shipment on WhatsApp',
      helpMessage: 'Hello VI LOGIX, I need help with tracking number {number}.',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    home: {
      eyebrow: 'Shipment tracking',
      title: 'Track your shipment.',
      intro: 'Enter the tracking number from your shipment confirmation email or message to see the latest update.',
      formEyebrow: 'Shipment lookup',
      formTitle: 'Enter your tracking number.',
      label: 'Tracking number',
      submit: 'Track shipment',
      note: 'Details are shown by the shipping partner handling your shipment.',
      errorEmpty: 'Enter a tracking number.',
      errorInvalid: 'This tracking number is not valid. Check it and try again.',
      pageTitle: 'Track Your Shipment | VI LOGIX',
      pageDescription: 'Enter your tracking number to view the latest shipment updates.',
    },
    unavailable: {
      eyebrow: 'Tracking unavailable',
      title: 'Tracking number not found.',
      body: 'Check the complete tracking number and try again.',
      back: 'Return to tracking',
      support: 'Ask VI LOGIX on WhatsApp',
    },
    notFound: {
      eyebrow: 'Error 404',
      title: 'Page not found.',
      body: 'This address does not exist. Enter your tracking number on the tracking page.',
      back: 'Go to tracking',
    },
    footer: { tagline: 'Fulfillment & Logistics', website: 'VI LOGIX website', websiteLabel: 'Go to the VI LOGIX website', help: 'Need help? WhatsApp' },
    embed: {
      loading: 'Loading tracking details…',
      errorTitle: 'Tracking details are taking too long to load.',
      errorBody: 'Try again in a moment, or ask us and we will check for you.',
      retry: 'Try again',
      support: 'Ask VI LOGIX on WhatsApp',
    },
    supportMessage: 'Hello VI LOGIX, I need help with my shipment tracking number.',
  },
  vi: {
    skipToContent: 'Đi đến nội dung chính',
    language: { label: 'Ngôn ngữ', en: 'EN', vi: 'VI' },
    header: {
      quote: 'Liên hệ',
      quoteLabel: 'Liên hệ VI LOGIX',
      help: 'Hỏi về vận đơn này qua WhatsApp',
      helpMessage: 'Xin chào VI LOGIX, mình cần hỗ trợ về mã vận đơn {number}.',
      menuOpen: 'Mở menu',
      menuClose: 'Đóng menu',
    },
    home: {
      eyebrow: 'Theo dõi vận đơn',
      title: 'Theo dõi vận đơn.',
      intro: 'Nhập mã vận đơn trong email hoặc tin nhắn xác nhận gửi hàng để xem cập nhật mới nhất.',
      formEyebrow: 'Tra cứu vận đơn',
      formTitle: 'Nhập mã vận đơn của bạn.',
      label: 'Mã vận đơn',
      submit: 'Theo dõi',
      note: 'Thông tin được hiển thị bởi đơn vị vận chuyển đang xử lý lô hàng của bạn.',
      errorEmpty: 'Vui lòng nhập mã vận đơn.',
      errorInvalid: 'Mã vận đơn không hợp lệ. Vui lòng kiểm tra và thử lại.',
      pageTitle: 'Theo dõi vận đơn | VI LOGIX',
      pageDescription: 'Nhập mã vận đơn để xem cập nhật mới nhất của lô hàng.',
    },
    unavailable: {
      eyebrow: 'Không thể tra cứu',
      title: 'Không tìm thấy mã vận đơn.',
      body: 'Kiểm tra lại đầy đủ mã vận đơn rồi thử lại.',
      back: 'Quay lại tra cứu',
      support: 'Hỏi VI LOGIX qua WhatsApp',
    },
    notFound: {
      eyebrow: 'Lỗi 404',
      title: 'Không tìm thấy trang.',
      body: 'Địa chỉ này không tồn tại. Hãy nhập mã vận đơn tại trang theo dõi.',
      back: 'Đến trang theo dõi',
    },
    footer: { tagline: 'Fulfillment & Logistics', website: 'Website VI LOGIX', websiteLabel: 'Đến website VI LOGIX', help: 'Cần hỗ trợ? WhatsApp' },
    embed: {
      loading: 'Đang tải thông tin vận đơn…',
      errorTitle: 'Thông tin vận đơn tải quá lâu.',
      errorBody: 'Hãy thử lại sau giây lát, hoặc nhắn cho chúng tôi để được kiểm tra giúp.',
      retry: 'Thử lại',
      support: 'Hỏi VI LOGIX qua WhatsApp',
    },
    supportMessage: 'Xin chào VI LOGIX, mình cần hỗ trợ về mã vận đơn.',
  },
}
