import { useEffect, useState } from 'react'
import type { PublicTrackingStatus, TrackingLocale } from '../types/tracking'

interface TrackingCopy {
  pageTitle: string
  pageDescription: string
  webApplicationDescription: string
  skipToContent: string
  hero: { eyebrow: string; title: string }
  languageLabel: string
  form: {
    trackingNumber: string
    placeholder: string
    track: string
    checking: string
  }
  status: Record<PublicTrackingStatus, string>
  result: {
    currentStatus: string
    updated: string
    vietnamTime: string
    copyLink: string
    linkCopied: string
    copyFailed: string
    origin: string
    destination: string
    progress: string
    estimatedDelivery: string
    estimateUnavailable: string
    estimateCaveat: string
    cancelledTitle: string
    cancelledDescription: string
  }
  clearance: {
    eyebrow: string
    title: string
    pending: string
    in_progress: string
    cleared: string
    action_required: string
    pendingMessage: string
    inProgressMessage: string
    clearedMessage: string
    actionMessage: string
  }
  activity: { eyebrow: string; latest: string; latestBadge: string; earlier: string; update: string; updates: string }
  feedback: {
    lookingFor: string
    shipmentFound: string
    noShipment: string
    checkNumber: string
    notFoundPrefix: string
    editNumber: string
    contactSupport: string
    unavailable: string
    couldNotLoad: string
    retryDescription: string
    retry: string
  }
}

export const TRACKING_COPY: Record<TrackingLocale, TrackingCopy> = {
  en: {
    pageTitle: 'Track Your Shipment | VI LOGIX',
    pageDescription: 'Track a VI LOGIX shipment from Vietnam-side receiving and preparation through international transit and delivery updates.',
    webApplicationDescription: 'Public shipment status lookup for VI LOGIX fulfillment and international logistics movements.',
    skipToContent: 'Skip to main content',
    hero: { eyebrow: 'VI LOGIX tracking', title: 'Track a shipment' },
    languageLabel: 'Tracking language',
    form: {
      trackingNumber: 'Tracking number', placeholder: 'e.g. VIE-260927-001', track: 'Track', checking: 'Checking…',
    },
    status: {
      information_received: 'Information received', received: 'Goods received', prepared: 'Prepared for dispatch', in_transit: 'In transit',
      customs_clearance: 'Customs clearance', out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled',
    },
    result: {
      currentStatus: 'Current status', updated: 'Updated', vietnamTime: 'Vietnam time', copyLink: 'Copy tracking link', linkCopied: 'Link copied',
      copyFailed: 'Copy failed — try again', origin: 'Origin', destination: 'Destination', progress: 'Shipment progress', estimatedDelivery: 'Estimated delivery',
      estimateUnavailable: 'Delivery estimate not available yet', estimateCaveat: 'Estimate only. Customs and carrier updates may change this window.',
      cancelledTitle: 'This shipment was cancelled.', cancelledDescription: 'Contact VI LOGIX if you need help with the shipment record.',
    },
    clearance: {
      eyebrow: 'International shipment', title: 'Customs clearance', pending: 'Pending', in_progress: 'In progress', cleared: 'Cleared', action_required: 'Action required',
      pendingMessage: 'Clearance begins after the shipment reaches the destination gateway.', inProgressMessage: 'Shipment documents are being reviewed for destination clearance.',
      clearedMessage: 'Destination customs clearance has been completed.', actionMessage: 'Additional information or action is required before the shipment can continue.',
    },
    activity: { eyebrow: 'Shipment activity', latest: 'Latest update', latestBadge: 'Latest', earlier: 'View earlier updates', update: 'update', updates: 'updates' },
    feedback: {
      lookingFor: 'Looking for', shipmentFound: 'Shipment found. Current status:', noShipment: 'No shipment found', checkNumber: 'Check the tracking number and try again.',
      notFoundPrefix: 'We could not find', editNumber: 'Edit tracking number', contactSupport: 'Contact support', unavailable: 'Tracking unavailable',
      couldNotLoad: 'We could not load the latest update.', retryDescription: 'Your tracking number has not been changed. Try again, or contact VI LOGIX for help.', retry: 'Retry',
    },
  },
  vi: {
    pageTitle: 'Theo dõi vận đơn | VI LOGIX',
    pageDescription: 'Theo dõi vận đơn VI LOGIX từ lúc tiếp nhận tại Việt Nam, chuẩn bị, vận chuyển quốc tế đến khi giao hàng.',
    webApplicationDescription: 'Tra cứu trạng thái vận đơn fulfillment và logistics quốc tế của VI LOGIX.',
    skipToContent: 'Đi đến nội dung chính',
    hero: { eyebrow: 'Theo dõi VI LOGIX', title: 'Theo dõi vận đơn' },
    languageLabel: 'Ngôn ngữ theo dõi',
    form: {
      trackingNumber: 'Mã vận đơn', placeholder: 'Ví dụ: VIE-260927-001', track: 'Theo dõi', checking: 'Đang kiểm tra…',
    },
    status: {
      information_received: 'Đã nhận thông tin', received: 'Đã nhận hàng', prepared: 'Đã chuẩn bị gửi', in_transit: 'Đang vận chuyển',
      customs_clearance: 'Thông quan', out_for_delivery: 'Đang giao hàng', delivered: 'Đã giao', cancelled: 'Đã hủy',
    },
    result: {
      currentStatus: 'Trạng thái hiện tại', updated: 'Cập nhật', vietnamTime: 'giờ Việt Nam', copyLink: 'Sao chép link theo dõi', linkCopied: 'Đã sao chép link',
      copyFailed: 'Không thể sao chép — thử lại', origin: 'Nơi gửi', destination: 'Nơi nhận', progress: 'Tiến trình vận đơn', estimatedDelivery: 'Dự kiến giao hàng',
      estimateUnavailable: 'Chưa có thời gian giao dự kiến', estimateCaveat: 'Đây là thời gian dự kiến. Thông quan và cập nhật từ đơn vị vận chuyển có thể làm thay đổi khoảng này.',
      cancelledTitle: 'Vận đơn này đã bị hủy.', cancelledDescription: 'Liên hệ VI LOGIX nếu bạn cần hỗ trợ về vận đơn.',
    },
    clearance: {
      eyebrow: 'Vận chuyển quốc tế', title: 'Trạng thái thông quan', pending: 'Chưa bắt đầu', in_progress: 'Đang xử lý', cleared: 'Đã thông quan', action_required: 'Cần xử lý',
      pendingMessage: 'Quá trình thông quan bắt đầu khi hàng đến cửa khẩu tại điểm nhận.', inProgressMessage: 'Chứng từ đang được xem xét để thông quan tại điểm nhận.',
      clearedMessage: 'Vận đơn đã hoàn tất thông quan tại điểm nhận.', actionMessage: 'Cần bổ sung thông tin hoặc thực hiện yêu cầu trước khi vận đơn có thể tiếp tục.',
    },
    activity: { eyebrow: 'Hành trình vận đơn', latest: 'Cập nhật mới nhất', latestBadge: 'Mới nhất', earlier: 'Xem cập nhật trước', update: 'cập nhật', updates: 'cập nhật' },
    feedback: {
      lookingFor: 'Đang tìm', shipmentFound: 'Đã tìm thấy vận đơn. Trạng thái hiện tại:', noShipment: 'Không tìm thấy vận đơn', checkNumber: 'Kiểm tra mã vận đơn và thử lại.',
      notFoundPrefix: 'Không tìm thấy', editNumber: 'Sửa mã vận đơn', contactSupport: 'Liên hệ hỗ trợ', unavailable: 'Không thể tra cứu',
      couldNotLoad: 'Không thể tải cập nhật mới nhất.', retryDescription: 'Mã vận đơn không thay đổi. Hãy thử lại hoặc liên hệ VI LOGIX để được hỗ trợ.', retry: 'Thử lại',
    },
  },
}

export const getTrackingLocale = (search: string): TrackingLocale => new URLSearchParams(search).get('lang') === 'vi' ? 'vi' : 'en'

export const useTrackingLocale = (search: string) => {
  const requestedLocale = getTrackingLocale(search)
  const [locale, setLocale] = useState<TrackingLocale>('en')
  useEffect(() => setLocale(requestedLocale), [requestedLocale])
  return locale
}
