/**
 * 环境变量工具函数
 */

// 获取网站域名
export const getWebsiteDomain = (): string => {
  return import.meta.env.VITE_WEBSITE_DOMAIN || 'localhost:5173';
};

export const getWebsiteUrl = (): string => {
  return `https://${getWebsiteDomain()}`;
};
