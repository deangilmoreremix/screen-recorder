"use client";

import { connectCloudinaryAnalytics } from 'cloudinary-video-analytics';

export const initAnalytics = (videoElement: HTMLVideoElement) => {
  const analytics = connectCloudinaryAnalytics(videoElement);
  
  analytics.startAutoTracking();
  analytics.startManualTracking({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
    publicId: `recording-${Date.now()}`,
  });

  return analytics;
};