import { mdiBookOpenPageVariantOutline, mdiHomeOutline, mdiImageOutline, mdiTagOutline } from '@mdi/js';

enum Permission {
  Block = -1,
  User = 0,
  Admin = 1,
  Master = 2,
  Root = 3
}

export type MenuItem = {
  title: string;
  icon: string;
  to: string;
  permission: Permission;
};

export const menu: MenuItem[] = [
  { title: '主页', icon: mdiHomeOutline, to: '/home', permission: Permission.User },
  { title: '标签管理', icon: mdiTagOutline, to: '/category', permission: Permission.Master },
  { title: '博客管理', icon: mdiBookOpenPageVariantOutline, to: '/blog', permission: Permission.Admin },
  { title: '图片管理', icon: mdiImageOutline, to: '/picture', permission: Permission.Admin }
];
